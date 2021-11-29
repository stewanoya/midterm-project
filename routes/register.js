const express = require("express");
const router = express.Router();
const emailCheck = require("../helpers/emailCheck.js");
const bcrypt = require("bcryptjs");
const emailTakenError = require("../public/scripts/registerNotice");
var cookieSession = require("cookie-session");
const app = express();

app.use(
  cookieSession({
    name: "session",
    // shoutout to anyone that gets the reference
    keys: ["The Temp at Night."],
  })
);
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
    VALUES($1, $2, $3)
    RETURNING *;`;

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
          return db
            .query(queryString, queryValues)
            .then((data) => {
              req.session.id = data.rows[0].id;
            })
            .then(() => {
              res.redirect("/");
            });
          //for now will redirect to homepage with no notice
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
