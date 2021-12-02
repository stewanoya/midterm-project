const express = require("express");
const router = express.Router();

const myResults = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.status(304).redirect("/login");
    }

<<<<<<< HEAD
  //   `SELECT COUNT(*)
  // FROM questions_answers
  // WHERE quiz_id IN (SELECT id FROM quizzes WHERE short_url =$1);`;

    const queryString = `SELECT results.*, quizzes.*, count(questions_answers.id) AS total
    FROM results
    JOIN quizzes on quizzes.id = results.quiz_id
    JOIN questions_answers ON quizzes.id = questions_answers.quiz_id
    WHERE user_id = $1
    GROUP BY results.id, quizzes.id;`;
=======
    const queryString = `SELECT name, score, title, cover_image_url, category, finish_at as date_completed, quizzes.short_url, COUNT(questions_answers.id) as count
    FROM users
    JOIN results ON users.id = user_id
    JOIN quizzes on quizzes.id = quiz_id
    JOIN questions_answers on quizzes.id = questions_answers.quiz_id
    WHERE users.id = $1
    GROUP BY users.name, results.score, quizzes.title, quizzes.cover_image_url, quizzes.category, results.finish_at, quizzes.short_url;`;

>>>>>>> 95f9eeb37564051a224095a9cdc11d2a734cb06a
    const queryValues = [session];

    return db.query(queryString, queryValues).then((data) => {
      const quizzes = data.rows;
      console.log("---->", quizzes[0].total)
      // const total =
      const templateVars = { session, quizzes };
      res.render("my-results", templateVars);
    });
  });

  return router;
};

module.exports = myResults;
