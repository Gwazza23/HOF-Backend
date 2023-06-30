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

const getUserCart = (id) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT products.id, products.name, products.quantity AS max_quantity, products.img_url, cart.quantity, cart.price * cart.quantity AS total_price FROM cart, products WHERE products.id = cart.product_id AND user_id = $1",
        [id],
        (error, results) => {
          if (error) {
            reject(error);
          } else if (!results || !results.rows) {
            reject(new Error("No rows returned from the query."));
          } else {
            resolve(results.rows);
          }
        }
      );
    });
  };

const addItemToCart = (user_id,product_id,quantity,price) => {
    return new Promise((resolve,reject) => {
        pool.query("INSERT INTO cart (user_id,product_id,quantity,price) VALUES ($1,$2,$3,$4)", [user_id,product_id,quantity,price], (error,results) => {
            if(error){
                reject(error)
            }
            resolve('Item sucessfully added to the cart')
        } )
    })
}


const updateItemInCart = (user_id,product_id,quantity) => {
    return new Promise((resolve,reject) => {
        pool.query("UPDATE cart SET quantity = $3 WHERE product_id = $2 AND user_id = $1", [user_id,product_id,quantity], (error,results) => {
            if(error){
                reject(error)
            }
            resolve('Item successfully updated in the cart')
        })
    })
}

const deleteItemInCart = (user_id,product_id) => {
    return new Promise((resolve,reject) => {
        pool.query("DELETE FROM cart WHERE product_id = $2 AND user_id = $1 " , [user_id,product_id], (error,results) => {
            if(error){
                reject(error)
            }
            resolve('Item was successfully removed from the cart')
        })
    })
}

module.exports = {
    getUserCart,
    addItemToCart,
    updateItemInCart,
    deleteItemInCart
}