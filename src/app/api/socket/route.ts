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

      socket.on("join-room", (roomId) => {
        console.log(`Socket ${socket.id} joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", socket.id);
      });

      socket.on("leave-room", (roomId) => {
        console.log(`Socket ${socket.id} left room ${roomId}`);
        socket.leave(roomId);
        socket.to(roomId).emit("user-left", socket.id);
      });

      socket.on("offer", ({ roomId, to, offer }) => {
        console.log(`Offer sent from ${socket.id} to ${to} in room ${roomId}`);
        socket.to(to).emit("offer", { from: socket.id, offer });
      });

      socket.on("answer", ({ roomId, to, answer }) => {
        console.log(`Answer sent from ${socket.id} to ${to} in room ${roomId}`);
        socket.to(to).emit("answer", { from: socket.id, answer });
      });

      socket.on("candidate", ({ roomId, to, candidate }) => {
        console.log(
          `Candidate sent from ${socket.id} to ${to} in room ${roomId}`
        );
        socket.to(to).emit("candidate", { from: socket.id, candidate });
      });

      socket.on("message", (message) => {
        console.log("Message received:", message);

        socket.broadcast.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

        const rooms = Array.from(socket.rooms);
        rooms.forEach((roomId) => {
          socket.to(roomId).emit("user-left", socket.id);
        });
      });
    });
  }

  return new Response("Socket initialized successfully", { status: 200 });
}
