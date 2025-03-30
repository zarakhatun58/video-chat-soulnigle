import express from "express";
import { storeUserEmbedding } from "../services/embeddingService.js";

const router = express.Router();

router.post("/test-embedding", async (req, res) => {
    try {
        const { userId, interests } = req.body;

        if (!userId || !Array.isArray(interests)) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        await storeUserEmbedding(userId, interests);

        res.status(200).json({ message: "Embedding stored successfully!" });
    } catch (error) {
        console.error("Error in /api/test-embedding:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
});

export default router;
