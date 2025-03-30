import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL instead of CONNECTION_STRING
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL!"))
  .catch((err) => console.error("❌ Connection Error:", err));

export default pool;
