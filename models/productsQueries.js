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

const getAllProducts = (req, res) => {
  pool.query("SELECT * FROM products ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).send(results.rows);
  });
};

const getSingleProduct = (product_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM products WHERE id = $1",
      [product_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );
  });
};

const getProductsByCategory = (category_id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, products.id FROM products,category WHERE products.category_id = category.id AND category.id = $1",
      [category_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        resolve(results.rows);
      }
    );
  });
};

const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM category", (error, results) => {
      if (error) {
        throw error;
      }
      resolve(results.rows);
    });
  });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  getProductsByCategory,
  getAllCategories,
};
