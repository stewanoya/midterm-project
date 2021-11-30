const express = require("express");
const router = express.Router();

const editQuiz = (db) => {
  // the get request loads the page with the proper questions to edit
  router.get("/:id", (req, res) => {
    const session = req.session.id;
    //grabbing just the cover image for the entire quiz, not sure if image in question_answers is supposed to be different per question.
    const queryString = `SELECT quizzes.id, quizzes.cover_image_url, quizzes.title, question_number, question, answer, choice_1, choice_2, choice_3, choice_4
    FROM quizzes
    JOIN questions_answers ON quizzes.id = quiz_id
    WHERE quizzes.id = $1;`;
    const editQuizID = req.params.id;

    const queryValues = [editQuizID];

    return db.query(queryString, queryValues).then((data) => {
      const quizzes = data.rows;
      if (quizzes.length === 0) {
        res.redirect("/");
        return;
      }
      const templateVars = { session, quizzes };
      res.render("edit-quiz", templateVars);
    });
  });

  router.post("/:id", (req, res) => {
    const session = req.session.id;
    console.log("HERE IS THE REQ", req.body);
    res.redirect("/my-quizzes");
  });

  return router;
};

module.exports = editQuiz;
