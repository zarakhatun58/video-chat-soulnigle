import express from "express";// Import User model
import ChatUser from "../models/ChatUser.js"; 

const router = express.Router();

// API to fetch meeting room based on user interests
router.get("/getMeetingRoom/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await ChatUser.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Match users with similar interests (Assuming you stored embeddings)
        const matchedUser = await ChatUser.findOne({
            _id: { $ne: userId }, // Exclude the current user
            interests: { $in: user.interests }, // Find users with common interests
        });

        if (!matchedUser) {
            return res.status(404).json({ error: "No matching user found" });
        }

        // Generate a room name (based on user IDs)
        const roomName = `room_${userId}_${matchedUser._id}`;

        res.json({ roomName });
    } catch (error) {
        console.error("Error finding meeting room:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
