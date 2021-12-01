const express = require("express");
const router = express.Router();

const editQuiz = (db) => {
  // the get request loads the page with the proper questions to edit
  router.get("/:id", (req, res) => {
    const session = req.session.id;
    //grabbing just the cover image for the entire quiz, not sure if image in question_answers is supposed to be different per question.
    const queryString = `SELECT quizzes.id, quizzes.cover_image_url, quizzes.title, question_number, question, answer, choice_1, choice_2, choice_3, choice_4, questions_answers.id as questionID, image_url, ispublic
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
    const quiz = req.body;
    const quizID = req.params.id;
    let isPublic = `TRUE`;
    if (!req.body.ispublic) {
      isPublic = `FALSE`;
    }

    const queryString = `UPDATE quizzes
    SET title = $1,
    cover_image_url = $2,
    ispublic = $3
    WHERE quizzes.id = $4;
    `;
    const queryValues = [quiz.title, quiz.cover_image_url, isPublic, quizID];
    return db
      .query(queryString, queryValues)
      .then(() => {
        for (let i = 0; i < req.body.question.length; i++) {
          // will check the answer input against the choice, and set the value to the exact same as the matching choice field
          let answer = "";

          if (req.body.answer[i] === "choice1") {
            answer = req.body.choice_1[i];
          }
          if (req.body.answer[i] === "choice2") {
            answer = req.body.choice_2[i];
          }
          if (req.body.answer[i] === "choice3") {
            answer = req.body.choice_3[i];
          }
          if (req.body.answer[i] === "choice4") {
            answer = req.body.choice_4[i];
          }

          let queryString = `UPDATE questions_answers
        SET question = $1,
        image_url = $2,
        choice_1 = $3,
        choice_2 = $4,
        answer = $5
        `;

          // will check if there are more than 2 choices, and add the queries incrementally
          if (req.body.choice_3) {
            queryString += `, choice_3 = $7`;
            if (req.body.choice_4) {
              queryString += `, choice_4 = $8`;
            }
          }
          queryString += `WHERE questions_answers.id = $6;`;
          const queryValues = [
            req.body.question[i],
            req.body.image_url[i],
            req.body.choice_1[i],
            req.body.choice_2[i],
            answer,
            req.body.questionid[i],
            req.body.choice_3[i],
            req.body.choice_4[i],
          ];
          db.query(queryString, queryValues);
        }
      })
      .then(() => {
        res.redirect("/my-quizzes");
      })
      .catch((e) => console.log(e));
  });

  return router;
};

module.exports = editQuiz;
