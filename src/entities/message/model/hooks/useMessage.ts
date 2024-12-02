"use client";

import { useState } from "react";

export const useMessages = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };

  return { messages, addMessage };
};
