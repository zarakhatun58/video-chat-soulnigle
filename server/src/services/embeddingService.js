import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateInterestVector(interests) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: interests.join(", "),
    });
    // Adjust this if the API response structure is different
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating interest vector:", error);
    throw error;
  }
}
