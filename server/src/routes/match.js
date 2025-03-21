import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../config/db.js";

const router = express.Router();

router.get("/match", authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  // Get the logged-in user's interest vector
  const userResult = await pool.query("SELECT interest_vector FROM users WHERE id = $1", [userId]);

  if (userResult.rows.length === 0 || !userResult.rows[0].interest_vector) {
    return res.status(400).json({ message: "User vector not found" });
  }

  const userVector = userResult.rows[0].interest_vector;

  // Find similar users using Cosine Similarity
  const matchQuery = `
    SELECT id, username, email, interests, 
      1 - (interest_vector <=> $1) AS similarity
    FROM users
    WHERE id != $2
    ORDER BY similarity DESC
    LIMIT 5;
  `;

  const matches = await pool.query(matchQuery, [userVector, userId]);
  res.json({ matches: matches.rows });
});

export default router;
