import express from "express";
import { getAllUsers, getProfile, loginUser, registerUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a new user
// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password, interests } = req.body;

//     // Check if user exists
//     const existingUser = await ChatUser.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = new ChatUser({ username, email, password: hashedPassword, interests });
//     await newUser.save();

//     res.json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", authMiddleware, getAllUsers);
router.get("/profile", authMiddleware, getProfile);


export default router;
