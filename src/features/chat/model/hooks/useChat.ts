"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";

export const useChat = (
  socket: Socket,
  onMessageReceived: (message: string) => void
) => {
  useEffect(() => {
    socket.on("message", onMessageReceived);

    return () => {
      socket.off("message");
    };
  }, [socket, onMessageReceived]);
};
