const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
