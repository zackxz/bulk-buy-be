const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.get("/ping", (req, res) => {
  res.send("The server is reached successfully.");
});

module.exports = router;
