const express = require("express");
const router = express.Router();
const emailCheck = require("../helpers/emailCheck.js");
const passCheck = require("../helpers/passwordCheck");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const app = express();

app.use(
  cookieSession({
    name: "session",
    // shoutout to anyone that gets the reference
    keys: ["The Temp at Night."],
  })
);

const login = (db) => {
  router.get("/", (req, res) => {
    let session = req.session.id;
    // checks to see if user is signed in
    if (session) {
      // will redirect to the homepage if they are signed in
      res.redirect("/");
    } else {
      const templateVars = { session };
      res.render("login", templateVars);
    }
  });

  router.post("/", (req, res) => {
    const userEmail = req.body.email;
    const enteredPassword = req.body.password;

    emailCheck(userEmail, db)
      .then((result) => {
        if (!result) {
          res.send("email not found");
        }
        return result;
      })
      .then((result) => {
        const correctPass = passCheck(enteredPassword, result.password);
        if (correctPass) {
          req.session.id = result.id;
          res.redirect("/");
        } else {
          res.send("password incorrect");
        }
      });
  });

  return router;
};

module.exports = login;
