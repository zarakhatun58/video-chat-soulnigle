import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use Gemini API key

export async function generateInterestVector(interests) {
    try {
        const model = genAI.getGenerativeModel({ model: "embedding-001" });

        const response = await model.generateContent(interests.join(", "));
        const embedding = response.data.embedding;

        console.log("Generated Gemini embedding:", embedding);
        return embedding;
    } catch (error) {
        console.error("Error generating Gemini interest vector:", error);
        throw error;
    }
}

export async function storeUserEmbedding(userId, interests) {
    try {
        console.log("Storing embedding for user:", userId, "with interests:", interests);
        
        if (!userId || !Array.isArray(interests) || interests.length === 0) {
            throw new Error("Invalid userId or interests array");
        }

        const embedding = await generateInterestVector(interests);
        console.log("Generated embedding:", embedding);

        const updatedUser = await ChatUser.findByIdAndUpdate(userId, { interest_vector: embedding }, { new: true });
        
        if (!updatedUser) {
            throw new Error("User not found in database");
        }

        console.log("Successfully stored embedding for user:", userId);
        return updatedUser;
    } catch (error) {
        console.error("Error storing user embedding:", error);
        throw error;
    }
}


export async function findMatchingUser(currentUserId) {
    try {
        const currentUser = await ChatUser.findById(currentUserId);
        if (!currentUser || !currentUser.interest_vector) {
            throw new Error("User not found or no interest vector available");
        }

        const users = await ChatUser.find({ _id: { $ne: currentUserId }, interest_vector: { $exists: true } });

        let bestMatch = null;
        let highestSimilarity = -1;

        for (const user of users) {
            const similarity = cosineSimilarity(currentUser.interest_vector, user.interest_vector);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                bestMatch = user;
            }
        }

        return bestMatch;
    } catch (error) {
        console.error("Error finding matching user:", error);
        throw error;
    }
}


export async function getMeetingRoom(currentUserId) {
    try {
        const matchedUser = await findMatchingUser(currentUserId);
        if (!matchedUser) {
            return { message: "No matching user found" };
        }

        const roomName = `Meet-${currentUserId}-${matchedUser._id}`;
        return { roomName, matchedUser };
    } catch (error) {
        console.error("Error creating meeting room:", error);
        throw error;
    }
}

