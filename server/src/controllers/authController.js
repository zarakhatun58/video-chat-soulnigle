import { storeUserEmbedding } from "../services/embeddingService.js";
import pool from "../config/db.js";

async function registerUser(req, res) {
  const { username, email, password, interests } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, interests) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, interests]
    );

    // Store user embedding after signup
    await storeUserEmbedding(newUser.rows[0].id, interests);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
