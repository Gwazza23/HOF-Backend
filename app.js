require('dotenv').config()
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const userRouter = require("./routes/userRouter");

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000, httpOnly: false },
  })
);

app.use(
  cors({
    origin: "https://magnificent-narwhal-1e5ee7.netlify.app",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://magnificent-narwhal-1e5ee7.netlify.app");
  next();
});

app.use(bodyParser.json());
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
