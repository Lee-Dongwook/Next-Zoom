"use client";

import { useState } from "react";
import { useSocket } from "@/shared/lib/useSocket";
import { useStream } from "@/entities/stream/model/hooks/useStream";
import { useGroupCall } from "@/features/video-call/model/hooks/useGroupCall";
import { VideoPlayer } from "@/entities/stream/ui/VideoPlayer";

export default function GroupMeeting() {
  const socket = useSocket();
  const localStream = useStream();
  const [remoteStreams, setRemoteStreams] = useState<
    { id: string; stream: MediaStream }[]
  >([]);

  const addRemoteStream = (id: string, stream: MediaStream) => {
    setRemoteStreams((prev) => [...prev, { id, stream }]);
  };

  const removeRemoteStream = (id: string) => {
    setRemoteStreams((prev) =>
      prev.filter((participant) => participant.id !== id)
    );
  };

  useGroupCall({
    socket,
    localStream,
    onRemoteStream: addRemoteStream,
    onParticipantLeft: removeRemoteStream,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Group Meeting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl">
        {/* 로컬 비디오 */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Video</h2>
          <VideoPlayer stream={localStream} isLocal />
        </div>

        {/* 원격 비디오 */}
        {remoteStreams.map((participant) => (
          <div key={participant.id}>
            <h2 className="text-xl font-semibold mb-2">
              Participant {participant.id}
            </h2>
            <VideoPlayer stream={participant.stream} />
          </div>
        ))}
      </div>
    </div>
  );
}
