require("dotenv").config();
const password = process.env.DATABASE_PASSWORD;

const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: password,
  database: "postgres",
  host: "db.xxygadiioqynnbhufflh.supabase.co",
  port: 6543,
});

const getAllUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    if (results.rows.length === 0) {
      res.status(404).send("No users found");
      return;
    }
    res.status(200).send(results.rows);
  });
};

module.exports = {
  getAllUsers,
};
