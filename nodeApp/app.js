const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.send("Hello DevOps!");
});

app.listen(5000, () => {
  console.log("App running on port 5000");
});