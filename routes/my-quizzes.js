const express = require("express");
const router = express.Router();


const myQuizzes = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.redirect(304, "/login");
    }

    const queryString = `SELECT * FROM users
    JOIN quizzes ON users.id = creator_id
    WHERE users.id = 1;`;
    const queryValues = [session];

    return db.query(queryString).then((data) => {
      const quizzes = data.rows;
      const templateVars = { session, quizzes };
      res.render("my-quizzes", templateVars);
    });
  });

  return router;
};

module.exports = myQuizzes;
