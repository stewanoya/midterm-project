const express = require("express");
const router = express.Router();

const resultShare = (db) => {
  router.get("/:resultID/:shortURL", (req, res) => {
    const session = req.session.id;
    const shortURL = req.params.shortURL;
    const resultID = req.params.resultID;

    const queryString = `SELECT users.*, results.*, quizzes.*, count(questions_answers.id) AS count
      FROM results
      JOIN quizzes ON quizzes.id = results.quiz_id
      JOIN questions_answers ON quizzes.id = questions_answers.quiz_id
      JOIN users ON results.user_id = users.id
      WHERE quizzes.short_url = $1
      AND results.id = $2
      GROUP BY results.id, quizzes.id, users.id;`;
    const queryValues = [shortURL, resultID];

    return db.query(queryString, queryValues).then((data) => {
      const result = data.rows[0];
      const templateVars = { session, result };
      res.render("result-share", templateVars);
    });
  });

  return router;
};

module.exports = resultShare;
