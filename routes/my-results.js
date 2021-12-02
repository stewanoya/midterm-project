const express = require("express");
const router = express.Router();

const myResults = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.status(304).redirect("/login");
    }


    const queryString = `SELECT results.*, quizzes.*, count(questions_answers.id) AS total
    FROM results
    JOIN quizzes on quizzes.id = results.quiz_id
    JOIN questions_answers ON quizzes.id = questions_answers.quiz_id
    WHERE user_id = $1
    GROUP BY results.id, quizzes.id;`;
    const queryValues = [session];

    return db.query(queryString, queryValues).then((data) => {
      const quizzes = data.rows;
      console.log("---->", quizzes[0].total)
      const templateVars = { session, quizzes };
      res.render("my-results", templateVars);
    });
  });

  return router;
};

module.exports = myResults;
