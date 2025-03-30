import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import ChatUser from "../models/ChatUser.js"; // Ensure correct model import

const router = express.Router();

/**
 * Function to compute cosine similarity between two vectors.
 */
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return magA && magB ? dotProduct / (magA * magB) : 0;
}

/**
 * @route GET /api/match
 * @desc Find matching users based on interest vectors
 * @access Private (requires authentication)
 */
router.get("/match", authMiddleware, async (req, res) => {
    try {
        console.log("🔍 Checking req.user in match route:", req.user); // ✅ Should print { userId: '67e438ba50be23a0f96764d3' }

        if (!req.user || !req.user.userId) {
            console.error("❌ User ID is missing in req.user!");
            return res.status(401).json({ message: "Unauthorized, invalid user" });
        }

        const userId = req.user.userId;
        console.log("✅ User ID in match route:", userId);

        // Continue with your logic
        res.json({ message: "Success", userId });
    } catch (error) {
        console.error("❌ Error in /match:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
