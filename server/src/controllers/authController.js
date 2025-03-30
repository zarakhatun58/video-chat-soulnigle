import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ChatUser from "../models/ChatUser.js";
import { storeUserEmbedding } from "../services/embeddingService.js";

// 🔐 Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // ⚠️ Change this for production

// 🟢 Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, interests } = req.body;

    // Check if user already exists
    const existingUser = await ChatUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
// Store OpenAI Embedding after saving user
if (interests?.length > 0) {
  await storeUserEmbedding(user._id, interests);
}
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new ChatUser({ 
      username, 
      email, 
      password: hashedPassword, 
      interests 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔑 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await ChatUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, userId: user._id, username: user.username });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🟢 Get All Users (Requires Token)
export const getAllUsers = async (req, res) => {
  try {
    const users = await ChatUser.find().select("-password"); // Exclude password field

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 🔎 Get Profile (Protected Route)
export const getProfile = async (req, res) => {
  try {
    const user = await ChatUser.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, interests } = req.body;

    const updatedUser = await ChatUser.findByIdAndUpdate(
      userId,
      { name, email, interests },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // Update interest vector if interests change
    if (interests?.length > 0) {
      await storeUserEmbedding(userId, interests);
    }

    res.status(200).json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

