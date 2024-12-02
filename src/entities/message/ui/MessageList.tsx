import React from "react";

type MessageListProps = {
  messages: string[];
};

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="border p-4 h-64 overflow-y-auto">
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};
