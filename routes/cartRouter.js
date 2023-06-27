const expres = require("express");
const cartRouter = expres.Router();
const db = require("../models/cartQueries");
const db2 = require("../models/productsQueries");

cartRouter.get("/:id", async (req, res) => {
  try {
    const cart = await db.getUserCart(req.params.id);
    res.status(200).send(cart);
  } catch (error) {
    res.status(400).send("Bad Request");
  }
});

cartRouter.post("/", async (req, res) => {
    const { product_id, quantity, price } = req.body;
    if (!req.cookies.user_id) {
      res.status(400).send("Please log in before adding item to cart");
      return;
    }
  
    const cart = await db.getUserCart(req.cookies.user_id)
    const itemIndex = cart.findIndex((item) => item.id == product_id)
    if(itemIndex >= 0){
      res.status(400).send("That item is already in the cart")
      return;
    }
  
    const product = await db2.getSingleProduct(product_id)
    const productQuantity = product[0].quantity
    if(quantity > productQuantity){
      res.status(400).send("We're sorry, but the quantity you have selected exceeds the amount currently in stock. Please adjust your quantity or check back later.")
      return;
    }
  
    try {
      const cart = await db.addItemToCart(
        req.cookies.user_id,
        product_id,
        quantity,
        price
      );
      res.status(201).send(cart);
    } catch (error) {
      res.status(400).send("Bad Request");
    }
  });

  cartRouter.put("/", async (req, res) => {
    const { product_id, quantity } = req.body;
    try {
      const cart = await db.updateItemInCart(
        req.cookies.userId,
        product_id,
        quantity
      );
      res.status(200).send(cart);
    } catch (error) {
      res.status(400).send("Bad Request");
    }
  });
  
  cartRouter.delete("/:id", async (req, res) => {
    console.log(req.cookies.user_id)
    try {
      const cart = await db.deleteItemInCart(req.cookies.user_id, req.params.id);
      res.status(204).send(cart);
    } catch (error) {
      res.status(400).send("Bad Request");
    }
  });
  
  module.exports = cartRouter;
  