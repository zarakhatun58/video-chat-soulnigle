import express from "express";
import cors from "cors";
import http from "http"; // ✅ Required for WebSockets
import { Server } from "socket.io";
import connectDB from "./src/config/db.js"; // ✅ Import Mongoose connection
import authRoutes from "./src/routes/authRoutes.js";
import { setupSocket } from "./src/socket/socket.js";
import matchRoutes from "./src/routes/matchRoutes.js"
import testRoutes from "./src/routes/testRoutes.js"
import meetingRoutes from "./src/routes/meetingRoutes.js"

const app = express();
app.use(cors()); 
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", matchRoutes);
app.use("/api", testRoutes);
app.use("/api", meetingRoutes);

const PORT = process.env.PORT || 8000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Create HTTP server & WebSocket
const server = http.createServer(app);
const io = setupSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
