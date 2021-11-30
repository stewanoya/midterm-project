const express = require("express");
const router = express.Router();

const deleteQuiz = (db) => {
  router.post("/", (req, res) => {
    const queryString = `DELETE FROM quizzes WHERE quizzes.id = $1`;
    const deleteQuizID = req.baseUrl.slice(-1);
    const queryValues = [deleteQuizID];

    return db.query(queryString, queryValues).then(() => {
      res.redirect("/my-quizzes");
    });
  });

  return router;
};

module.exports = deleteQuiz;
