const express = require("express");
const router = express.Router();

const resultShare = (db) => {
  router.get("/:userID/:shortURL", (req, res) => {
    const session = req.session.id;
    const templateVars = { session };
    res.render("result-share", templateVars);
  });

  return router;
};

module.exports = resultShare;
