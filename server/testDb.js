import pg from "pg";

const pool = new pg.Pool({
  connectionString: "postgresql://vector_db_owner_new:Zara_786786786@ep-flat-night-a8yvkl7m-pooler.eastus2.azure.neon.tech/vector_db?sslmode=require",
  ssl: { rejectUnauthorized: false }, // Required for NeonDB
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL!"))
  .catch((err) => console.error("❌ Connection Error:", err));
