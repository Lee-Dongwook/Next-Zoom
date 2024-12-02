"use client";

import { useState } from "react";
import { useSocket } from "@/shared/lib/useSocket";
import { useMessages } from "@/entities/message/model/hooks/useMessage";
import { MessageList } from "@/entities/message/ui/MessageList";
import { useStream } from "@/entities/stream/model/hooks/useStream";
import { VideoPlayer } from "@/entities/stream/ui/VideoPlayer";
import { useChat } from "@/features/chat/model/hooks/useChat";
import { ChatInput } from "@/features/chat/ui/ChatInput";
import { useVideoCall } from "@/features/video-call/model/hooks/useVideoCall";

export default function MeetingPage() {
  const socket = useSocket();
  const { messages, addMessage } = useMessages();

  const localStream = useStream();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  useVideoCall({
    localStream,
    onRemoteStream: setRemoteStream,
  });

  useChat(socket, (message) => {
    addMessage(message);
  });

  const sendMessage = (message: string) => {
    socket.emit("message", message);
    addMessage(`You: ${message}`);
  };

  return (
    <div className="flex flex-co items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Meeting Room</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <div>
          <h2 className="text-xl font-semibold mb-2">Video</h2>
          <VideoPlayer stream={localStream} isLocal />
          {remoteStream && <VideoPlayer stream={remoteStream} />}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Chat</h2>
          <MessageList messages={messages} />
          <ChatInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
}
