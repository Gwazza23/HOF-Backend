const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/userQueries");

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await db.getUserByEmail(email);
        if (!user) {
          return done(null, false);
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
          return done(null, false);
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = db.getUserById(id, (err, done) => {
    if (err) {
      return done(err);
    }
  });
  done(null, user);
});

userRouter.get("/", db.getAllUsers);
userRouter.post("/register", db.createNewUser);
userRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send("Incorrect email or password");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.regenerate(() => {
        res.cookie("user_id", req.user.id);
        res.send("You are now logged in!");
      });
    });
  })(req, res, next);
});

module.exports = userRouter;
