const express = require("express");
const router = express.Router();
// I eventually want to move the email check function to another file.
// const { emailCheck } = require("./helpers/emailCheck");

const registerUser = (db) => {
  router.get("/", (req, res) => {
    res.render("register");
  });

  router.post("/", (req, res) => {
    const email = req.body.email;
    emailCheck(email)
      .then((result) => {
        if (!result) {
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
    const values = [email];
    return db
      .query(queryString, values)
      .then((data) => {
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
