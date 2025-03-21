// src/socket.js
import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production to restrict allowed origins
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New WebSocket connection:", socket.id);

    // When a user joins a room (e.g., after matching), they join a room with their userId.
    socket.on("join-room", (data) => {
      const { userId } = data;
      console.log(`User ${userId} joining room ${userId}`);
      socket.join(userId);
    });

    // Handle WebRTC offer
    socket.on("send-offer", (data) => {
      const { from, to, offer } = data;
      console.log(`Offer from ${from} to ${to}`);
      io.to(to).emit("receive-offer", { from, offer });
    });

    // Handle WebRTC answer
    socket.on("send-answer", (data) => {
      const { from, to, answer } = data;
      console.log(`Answer from ${from} to ${to}`);
      io.to(to).emit("receive-answer", { from, answer });
    });

    // Handle ICE candidates
    socket.on("send-ice-candidate", (data) => {
      const { from, to, candidate } = data;
      console.log(`ICE candidate from ${from} to ${to}`);
      io.to(to).emit("receive-ice-candidate", { from, candidate });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}
