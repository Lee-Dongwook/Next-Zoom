/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */

import { NextRequest } from "next/server";
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server | null = null;

export async function GET(req: NextRequest) {
  if (!io) {
    const {
      server,
    }: { server: HTTPServer } = require("next/dist/server/api-utils");

    io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("message", (message) => {
        console.log("Message received:", message);

        socket.broadcast.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket initialized successfully", { status: 200 });
}
