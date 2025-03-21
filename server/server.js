import express from "express";
import cors from "cors";
import http from "http"; // ✅ Required for WebSockets
import { Server } from "socket.io";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import { setupSocket } from "./src/socket/socket.js";

const app = express();
app.use(express.json());
app.use(cors()); 
app.use("/api/auth", authRoutes);

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT || 5000; // ✅ Set default port

// 🟢 Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 🟢 Get all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// 🟢 Add a new user
app.post("/users", async (req, res) => {
  try {
    const { username, email, password, interests } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, interests) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, interests]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

const server = http.createServer(app); // ✅ Use server instance

// Setup Socket.io for real-time video signaling
const io = setupSocket(server);

// ✅ Fix: Use `server.listen` instead of `app.listen`
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
