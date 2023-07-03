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
  db.getUserById(id, (err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
});

const isAuthenticated = (req, res, next) => {
  if (req.params.id === req.cookies["user_id"]) {
    return next();
  }
  res.status(401).send("Unauthorized");
};

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
      const userId = user.id;
      res.cookie("user_id", req.user.id, {
        secure: true,
        httpOnly: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
      });
      console.log(req.user);
      res.send({ userId });
    });
  })(req, res, next);
});
userRouter.get("/profile/:id", isAuthenticated, db.getUserDataById);
userRouter.get("/", db.getAllUsers);
userRouter.get("/logout", (req, res) => {
  req.logout(() => {});
  res.send("you are now logged out");
});
userRouter.post("/register", db.createNewUser);
userRouter.post("/info", db.addInfo);

module.exports = userRouter;
