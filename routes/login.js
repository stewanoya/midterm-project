const express = require("express");
const router = express.Router();
const emailCheck = require("../helpers/emailCheck.js");
const passCheck = require("../helpers/passwordCheck");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");

const login = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;
    const errorMsg = "";
    // checks to see if user is signed in
    if (session) {
      // will redirect to the homepage if they are signed in
      res.redirect("/");
    } else {
      const templateVars = { session, errorMsg };
      res.render("login", templateVars);
    }
  });

  router.post("/", (req, res) => {
    const session = req.session.id;
    const userEmail = req.body.email.toLowerCase();
    const enteredPassword = req.body.password;
    const errorMsg = `<p class="error">Please make sure all fields are filled out and try again!</p>`;
    if (!userEmail || !enteredPassword) {
      const templateVars = { session, errorMsg };
      res.render("login", templateVars);
    }

    emailCheck(userEmail.toLowerCase(), db)
      .then((result) => {
        if (!result) {
          const session = req.session.id;
          const errorMsg = `<p class="error">You sure that Email is correct?</p>`;
          const templateVars = { session, errorMsg };
          res.render("login", templateVars);
        }
        return result;
      })
      .then((result) => {
        const correctPass = passCheck(enteredPassword, result.password);
        if (correctPass) {
          req.session.id = result.id;
          res.redirect("/");
        } else {
          const session = req.session.id;
          const errorMsg = `<p class="error">You sure that Password is correct?</p>`;
          const templateVars = { session, errorMsg };
          res.render("login", templateVars);
        }
      })
      .catch((e) => {
        return console.error(e);
      });
  });

  return router;
};

module.exports = login;
