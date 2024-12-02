"use client";

import { useEffect, useRef } from "react";

type UseVideoCallProps = {
  localStream: MediaStream | null;
  onRemoteStream: (stream: MediaStream) => void;
};

export const useVideoCall = ({
  localStream,
  onRemoteStream,
}: UseVideoCallProps) => {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!localStream) return;

    const peerConnection = new RTCPeerConnection();

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      onRemoteStream(remoteStream);
    };

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnectionRef.current = peerConnection;

    return () => {
      peerConnection.close();
    };
  }, [localStream, onRemoteStream]);

  return peerConnectionRef.current;
};
