require("dotenv").config();
const password = process.env.DATABASE_PASSWORD;
const bcrypt = require("bcrypt");
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

const createNewUser = (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        res.status(500).send("Internal server error");
        return;
      }

      if (results.rows.length > 0) {
        res.status(400).send("Account by that email already exists");
        return;
      }

      pool.query(
        "INSERT INTO users (email,password,firstName,lastName) VALUES ($1,$2,$3,$4)",
        [email, hashedPassword, firstName, lastName],
        (error, results) => {
          if (error) {
            res.status(500).send("Internal server error");
            return;
          }
          res.status(201).send("User added successfully");
        }
      );
    }
  );
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.rows[0]);
      }
    );
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id  = $1", [id], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows[0]);
    });
  });
};

module.exports = {
  getAllUsers,
  createNewUser,
  getUserByEmail,
  getUserById
};
