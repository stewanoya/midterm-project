const express = require("express");
const router = express.Router();
const emailCheck = require("../helpers/emailCheck.js");
const bcrypt = require("bcryptjs");
const emailTakenError = require("../public/scripts/registerNotice");

const registerUser = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });
  router.post("/", (req, res) => {
    const userEmail = req.body.email;
    const userName = req.body.name;
    // need to be encrypted
    const userPassword = req.body.password;

    const queryString = `INSERT into USERS (name, email, password)
    VALUES($1, $2, $3)`;

    const queryValues = [
      userName,
      userEmail,
      bcrypt.hashSync(userPassword, 10),
    ];

    //calling asynchronous email check function
    emailCheck(userEmail, db)
      .then((result) => {
        // if there is no result, it means the email doesn't exist in the database
        if (!result) {
          db.query(queryString, queryValues);
          //for now will redirect to homepage with no notice
          res.redirect("/");
        }
        emailTakenError();
      })
      .catch((err) => {
        console.error({ error: err.message });
      });
  });

  return router;
};

module.exports = registerUser;
