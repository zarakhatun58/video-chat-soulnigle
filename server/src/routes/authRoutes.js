import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult }from "express-validator";
import pool from './../config/db.js';
import authMiddleware from "../middleware/authMiddleware.js";
import { generateInterestVector } from "../services/embeddingService.js";


const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET; // Store this in .env

// 🟢 User Registration
// router.post(
//   "/register",
//   [
//     body("username").notEmpty().withMessage("Username is required"),
//     body("email").isEmail().withMessage("Invalid email"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
//     body("interests").isArray().withMessage("Interests should be an array"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { username, email, password, interests } = req.body;

//     try {
//       // Check if user already exists
//       const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//       if (existingUser.rows.length > 0) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       // Insert user into DB
//       const newUser = await pool.query(
//         "INSERT INTO users (username, email, password, interests) VALUES ($1, $2, $3, $4) RETURNING *",
//         [username, email, hashedPassword, interests]
//       );

//       // Generate JWT token
//       const token = jwt.sign({ userId: newUser.rows[0].id }, SECRET_KEY, { expiresIn: "1h" });

//       res.status(201).json({ token, user: newUser.rows[0] });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );
router.post("/register", async (req, res) => {
    const { username, email, password, interests } = req.body;
    
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const interestVector = await generateInterestVector(interests);
  
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, interests, interest_vector) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, interests",
      [username, email, hashedPassword, interests, interestVector]
    );
  
    res.status(201).json({ user: newUser.rows[0] });
  });

// 🔵 User Login
router.post(
    "/login",
    [
      body("email").isEmail().withMessage("Invalid email"),
      body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  
        if (user.rows.length === 0) {
          console.log("❌ User not found in DB");
          return res.status(400).json({ message: "Invalid credentials" });
        }
  
        console.log("✅ User found:", user.rows[0]); // Debugging log
      
  
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        console.log("🔍 Password Match Status:", isMatch); // Debugging log

        // const hashedPassword = "$2b$10$JelRpE2/yMfB/7o0Q7gHm.QU6uGqO5bcct2jikzcFYIjduKlye9d6"; // From DB
        // const userInputPassword = "zara@5858"; 
        // async function hashNewPassword() {
        //     const plainPassword = "zara@5858";
        //     const hashedPassword = await bcrypt.hash(plainPassword, 10);
        //     console.log("New Hashed Password:", hashedPassword);
        //   }
          
        //   hashNewPassword();
        // bcrypt.compare(userInputPassword, hashedPassword).then((isMatch) => {
        //     console.log("Password Match:", isMatch);
        //   });
  
        if (!isMatch) {
          console.log("❌ Password does not match");
          return res.status(400).json({ message: "Invalid credentials" });
        }
  
        // Generate JWT
        const token = jwt.sign({ userId: user.rows[0].id }, SECRET_KEY, { expiresIn: "1h" });
        const { password, ...userWithoutPassword } = user.rows[0];
        res.json({ token, user: userWithoutPassword });
        // res.json({ token, user: user.rows[0] });
      } catch (err) {
        console.error("⚠️ Server Error:", err);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  
  router.get("/profile", authMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const user = await pool.query("SELECT id, username, email, interests FROM users WHERE id = $1", [userId]);
  
    if (!user.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
  
    res.json(user.rows[0]);
  });

  const result = await pool.query("SELECT NOW()"); // Test connection
console.log("Database Time:", result.rows[0].now);

export default router;
