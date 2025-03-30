import jwt from "jsonwebtoken";
import ChatUser from "../models/ChatUser.js";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Extract token
        const token = authHeader.split(" ")[1];
        console.log("🔹 Extracted Token:", token);

        // Decode JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔹 Decoded Token:", decoded); // Should print: { id: '67e438ba50be23a0f96764d3', iat: ..., exp: ... }

        if (!decoded.id) {
            return res.status(400).json({ message: "Invalid token, missing user ID" });
        }

        // Ensure the ID is a valid MongoDB ObjectId
        if (!decoded.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Check if user exists
        console.log("🔍 Looking for user with ID:", decoded.id);
        const user = await ChatUser.findById(decoded.id);

        if (!user) {
            console.error("❌ User not found in database with ID:", decoded.id);
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Attach user ID properly
        req.user = { userId: user._id.toString() };
        console.log("✅ Authenticated user:", req.user);

        next();
    } catch (error) {
        console.error("❌ Auth Middleware Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
