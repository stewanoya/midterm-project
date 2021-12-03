const express = require("express");
const router = express.Router();

const quizStart = (db) => {
  router.get("/:shortURL", (req, res) => {
    const session = req.session.id;
    const shortURL = req.params.shortURL;
    const queryString = `SELECT users.name, quizzes.*, COUNT(questions_answers.id) as count
      FROM quizzes
      JOIN users ON users.id = creator_id
      JOIN questions_answers ON quizzes.id = quiz_id
      WHERE short_url = $1
      GROUP BY users.name, quizzes.id `;
    const queryValues = [shortURL];

    return db.query(queryString, queryValues).then((data) => {
      const quiz = data.rows[0];
      const templateVars = { session, quiz };
      res.render("quiz-start", templateVars);
    });
  });

  return router;
};

module.exports = quizStart;
