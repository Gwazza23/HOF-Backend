const express = require("express");
const userRouter = express.Router();
const db = require("../models/userQueries");

userRouter.get("/", db.getAllUsers);
userRouter.post("/register", db.createNewUser);

module.exports = userRouter;
