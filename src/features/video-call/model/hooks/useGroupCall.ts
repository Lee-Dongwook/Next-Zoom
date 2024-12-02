"use client";

import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

type UseGroupCallProps = {
  socket: Socket;
  localStream: MediaStream | null;
  onRemoteStream: (id: string, stream: MediaStream) => void;
  onParticipantLeft: (id: string) => void;
};

export const useGroupCall = ({
  socket,
  localStream,
  onRemoteStream,
  onParticipantLeft,
}: UseGroupCallProps) => {
  const peerConnections = useRef<{ [id: string]: RTCPeerConnection }>({});

  useEffect(() => {
    if (!localStream) return;

    socket.on("user-joined", (id) => {
      if (peerConnections.current[id]) return;

      const peerConnection = new RTCPeerConnection();

      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        onRemoteStream(id, remoteStream);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", { to: id, candidate: event.candidate });
        }
      };

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnections.current[id] = peerConnection;

      peerConnection
        .createOffer()
        .then((offer) => peerConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", {
            to: id,
            offer: peerConnection.localDescription,
          });
        })
        .catch((error) => console.error("Error creating offer:", error));
    });

    socket.on("offer", async ({ from, offer }) => {
      const peerConnection = new RTCPeerConnection();

      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        onRemoteStream(from, remoteStream);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("candidate", { to: from, candidate: event.candidate });
        }
      };

      localStream?.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer)
        );

        const answer = await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(answer);

        socket.emit("answer", {
          to: from,
          answer: peerConnection.localDescription,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    socket.on("answer", ({ from, answer }) => {
      const peerConnection = peerConnections.current[from];
      if (!peerConnection) {
        console.error("Peer connection not found for answer");
        return;
      }
      peerConnection
        .setRemoteDescription(new RTCSessionDescription(answer))
        .catch((error) => {
          console.error("Error setting remote description for answer:", error);
        });
    });

    socket.on("candidate", ({ from, candidate }) => {
      const peerConnection = peerConnections.current[from];
      if (!peerConnection) {
        console.error("Peer connection not found for candidate");
        return;
      }
      peerConnection
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error("Error adding received ICE candidate:", error);
        });
    });

    socket.on("user-left", (id) => {
      if (peerConnections.current[id]) {
        peerConnections.current[id].close();
        delete peerConnections.current[id];
      }
      onParticipantLeft(id);
    });

    return () => {
      Object.values(peerConnections.current).forEach((peer) => peer.close());
      peerConnections.current = {};
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("candidate");
      socket.off("user-left");
    };
  }, [localStream, socket, onRemoteStream, onParticipantLeft]);
};
