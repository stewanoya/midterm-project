const express = require("express");
const router = express.Router();

const deleteQuiz = (db) => {
  router.post("/:id", (req, res) => {
    const queryString = `DELETE FROM quizzes WHERE id = $1`;
    const deleteQuizID = req.params.id;
    const queryValues = [deleteQuizID];

    return db.query(queryString, queryValues).then(() => {
      res.redirect("/my-quizzes");
    });
  });

  return router;
};

module.exports = deleteQuiz;
