"use client";

import { useSocket } from "@/shared/lib/useSocket";
import { useMessages } from "@/entities/message/model/hooks/useMessage";
import { MessageList } from "@/entities/message/ui/MessageList";
import { useChat } from "@/features/chat/model/hooks/useChat";
import { ChatInput } from "@/features/chat/ui/ChatInput";

export default function MeetingPage() {
  const socket = useSocket();
  const { messages, addMessage } = useMessages();

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
      <div className="w-full max-w-md mt-4">
        <MessageList messages={messages} />
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  );
}
