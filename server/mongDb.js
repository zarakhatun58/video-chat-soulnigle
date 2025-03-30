import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://jkhatun258:5OVtTAwLRv53bIEw@notesapp.s699o.mongodb.net/"

mongoose.set("debug", true);  // Logs queries to help debug
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of infinite waiting
})
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

export default mongoose;
