const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

const userRouter = require("./routes/userRouter");

app.use(
  cors({
    origin: "https://magnificent-narwhal-1e5ee7.netlify.app",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://magnificent-narwhal-1e5ee7.netlify.app"
  );
  next();
});

app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
