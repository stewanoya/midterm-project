const express = require("express");
const router = express.Router();
const emailCheck = require("../helpers/emailCheck.js");
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

const registerUser = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;
    const errorMsg = ``;
    // checks to see if user is signed in
    if (session) {
      // will redirect to the homepage if they are signed in
      res.redirect("/");
    }
    //passing the cookie to the page, so the header has it
    const templateVars = { session, errorMsg };
    res.render("register", templateVars);
  });

  router.post("/", (req, res) => {
    const userEmail = req.body.email;
    const userName = req.body.name;
    const userPassword = req.body.password;

    if (!userEmail || !userName || !userPassword) {
      const errorMsg = `<p class="error">Please make sure all fields are filled out and try again!</p>`;
      const session = req.session.id;
      const templateVars = { errorMsg, session };
      res.render("register", templateVars);
    }

    const queryString = `INSERT into USERS (name, email, password)
    VALUES($1, $2, $3)
    RETURNING *;`;

    const queryValues = [
      userName,
      userEmail.toLowerCase(),
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
              //for now will redirect to homepage with no notice
              res.redirect("/");
            });
        }
        const errorMsg = `<p class="error">Sorry that email is taken, please try again!</p>`;
        const session = req.session.id;
        const templateVars = { errorMsg, session };
        res.render("register", templateVars);
      })
      .catch((err) => {
        console.error({ error: err.message });
      });
  });

  return router;
};

module.exports = registerUser;
