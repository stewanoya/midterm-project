const express = require("express");
const router = express.Router();

const myResults = (db) => {
  router.get("/", (req, res) => {
    const user_id = req.session.id;

    if (!user_id) {
      res.status(304).redirect("/login");
    }

    const queryString = `SELECT users.name, results.*, quizzes.*, count(questions_answers.id) AS total
      FROM results
      JOIN quizzes ON quizzes.id = results.quiz_id
      JOIN questions_answers ON quizzes.id = questions_answers.quiz_id
      JOIN users ON results.user_id = users.id
      WHERE user_id = $1
      GROUP BY results.id, quizzes.id, users.id;`;
    const queryValues = [user_id];

    return db.query(queryString, queryValues).then((data) => {
      const quizzes = data.rows;
      console.log("---->", quizzes[0].total)
      // const total =
      const templateVars = { session: user_id, quizzes };
      res.render("my-results", templateVars);
    });
  });

  return router;
};

module.exports = myResults;
