require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const productsRouter = require("./routes/productsRouter");
const passport = require("passport");

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: "none",
    },
  })
);

app.use(
  cors({
    origin: "https://magnificent-narwhal-1e5ee7.netlify.app",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://magnificent-narwhal-1e5ee7.netlify.app"
  );
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
