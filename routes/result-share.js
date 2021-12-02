const express = require("express");
const router = express.Router();

const resultShare = (db) => {
  router.get("/:resultID/:shortURL", (req, res) => {
    const session = req.session.id;
    const shortURL = req.params.shortURL;
    const resultID = req.params.resultID;

    /*
    const queryString = `SELECT results.id, name, score, title, cover_image_url, category, finish_at, quizzes.short_url, COUNT(questions_answers.id) as count
      FROM users
      JOIN results ON users.id = user_id
      JOIN quizzes on quizzes.id = quiz_id
      JOIN questions_answers on quizzes.id = questions_answers.quiz_id
      WHERE users.id = $1
      AND quizzes.short_url = $2
      AND results.id = $3
      GROUP BY results.id, users.name, results.score, quizzes.title, quizzes.cover_image_url, quizzes.category, results.finish_at, quizzes.short_url;`;
    const queryValues = [session, shortURL, resultID];
*/
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
      console.log(templateVars);
      res.render("result-share", templateVars);
    });
  });

  return router;
};

module.exports = resultShare;
