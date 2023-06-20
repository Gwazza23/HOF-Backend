const express = require('express');
const productsRouter = express.Router();
const db = require('../models/productsQueries');

productsRouter.get("/", db.getAllProducts);

productsRouter.get("/item/:id", async (req, res) => {
  const item = await db.getSingleProduct(req.params.id);
  res.status(200).send(item);
});
productsRouter.get("/category/:id", async (req, res) => {
  const category = await db.getProductsByCategory(req.params.id);
  res.status(200).send(category);
});
productsRouter.get("/category", async (req,res) => {
  const categories = await db.getAllCategories();
  res.status(200).send(categories)
})

module.exports = productsRouter;
