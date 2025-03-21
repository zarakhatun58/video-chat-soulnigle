
const pool = require("../config/db");

const createUser = async (username, email, hashedPassword, interests) => {
  const { rows } = await pool.query(
    `INSERT INTO users (username, email, password, interests) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [username, email, hashedPassword, interests]
  );
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
};

module.exports = { createUser, findUserByEmail };
