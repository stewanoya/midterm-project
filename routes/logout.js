const express = require("express");
const router = express.Router();

const logout = () => {
  router.post("/", (req, res) => {
    req.session = null;
    res.redirect(302, `/`);
  });
  return router;
};

module.exports = logout;
