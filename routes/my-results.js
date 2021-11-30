const express = require("express");
const router = express.Router();

const myResults = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.status(304).redirect("/login");
    }

    const queryString = `SELECT name, score, title, cover_image_url, category, finish_at as date_completed, quizzes.short_url
    FROM users
    JOIN results ON users.id = user_id
    JOIN quizzes on quizzes.id = quiz_id
    WHERE users.id = $1;`;
    const queryValues = [session];

    return db.query(queryString, queryValues).then((data) => {
      const quizzes = data.rows;
      const templateVars = { session, quizzes };
      res.render("my-results", templateVars);
    });
  });

  return router;
};

module.exports = myResults;
