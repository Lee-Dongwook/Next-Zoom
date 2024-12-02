"use client";

import { useState } from "react";

type ChatInputProps = {
  onSendMessage: (message: string) => void;
};

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow border px-2 py-1"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSend}
        className="ml-2 px-4 py-1 bg-blue-600 text-white rounded-md"
      >
        Send
      </button>
    </div>
  );
};
