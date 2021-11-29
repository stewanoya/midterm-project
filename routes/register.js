const express = require("express");
const router = express.Router();
// I eventually want to move the email check function to another file.
// const { emailCheck } = require("./helpers/emailCheck");

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

    const queryValues = [userName, userEmail, userPassword];

    //calling asynchronous email check function
    emailCheck(userEmail)
      .then((result) => {
        // if there is no result, it means the email doesn't exist in the database
        if (!result) {
          db.query(queryString, queryValues);
          res.send("email is good");
        }
        res.send("email taken");
      })
      .catch((err) => {
        console.error({ error: err.message });
      });
  });

  const emailCheck = (email) => {
    const queryString = `SELECT * FROM users
    WHERE email = $1`;
    const queryValues = [email];
    // db query to return data if the email exists
    return db
      .query(queryString, queryValues)
      .then((data) => {
        // set data to null if query returns empty array
        if (data.rows[0] === undefined) {
          return (data.rows = null);
        }
        if (data.rows[0].email.toLowerCase() === email.toLowerCase()) {
          return data.rows[0];
        }
      })
      .catch((err) => {
        console.error({ error: err.message });
      });
  };

  return router;
};

module.exports = registerUser;
