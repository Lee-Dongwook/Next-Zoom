"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

export const useSocket = (): Socket => {
  const socketRef = useRef<Socket>();

  if (!socketRef.current) {
    socketRef.current = io(SOCKET_URL);
  }

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};
