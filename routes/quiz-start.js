const express = require("express");
const router = express.Router();

const quizStart = (db) => {
  router.get("/:shortURL", (req, res) => {
    const session = req.session.id;
    const shortURL = req.params.shortURL;
    const queryString = `SELECT users.name, quizzes.*
    FROM quizzes
    JOIN users on users.id = creator_id
    WHERE short_url = $1; `;
    const queryValues = [shortURL];

    return db.query(queryString, queryValues).then((data) => {
      const quiz = data.rows[0];
      console.log("HERE IS THE QUIZ RESULT", quiz);
      const templateVars = { session, quiz };
      res.render("quiz-start", templateVars);
    });
  });

  return router;
};

module.exports = quizStart;
