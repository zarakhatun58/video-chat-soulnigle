import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New WebSocket connection:", socket.id);

    socket.on("join-room", ({ userId }) => {
      console.log(`User ${userId} joining room ${userId}`);
      socket.join(userId);
    });

    socket.on("send-offer", ({ from, to, offer }) => {
      console.log(`Offer from ${from} to ${to}`);
      io.to(to).emit("receive-offer", { from, offer });
    });

    socket.on("send-answer", ({ from, to, answer }) => {
      console.log(`Answer from ${from} to ${to}`);
      io.to(to).emit("receive-answer", { from, answer });
    });

    socket.on("send-ice-candidate", ({ from, to, candidate }) => {
      console.log(`ICE candidate from ${from} to ${to}`);
      io.to(to).emit("receive-ice-candidate", { from, candidate });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}
