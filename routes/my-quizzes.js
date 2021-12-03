const express = require("express");
const router = express.Router();

const myQuizzes = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.status(304).redirect("/login");
    }

    const queryString = `SELECT quizzes.id, title, category, created_at::date, ispublic, cover_image_url, quizzes.creator_id as creator, short_url
      FROM quizzes
      JOIN users ON users.id = creator_id
      WHERE users.id = $1;`;
    const queryValues = [session];

    return db.query(queryString, queryValues).then((data) => {
      const quizzes = data.rows;
      const templateVars = { session, quizzes };
      res.render("my-quizzes", templateVars);
    });
  });

  return router;
};

module.exports = myQuizzes;
