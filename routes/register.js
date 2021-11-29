const express = require("express");
const router = express.Router();

const registerUser = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });
  return router;
};

module.exports = registerUser;
