import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    interests: { type: [String], default: [] },
    interest_vector: { type: [Number], default: [] } // Store OpenAI embedding
});
const ChatUser = mongoose.model("ChatUser", UserSchema);
export default ChatUser;
