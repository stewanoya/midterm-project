const express = require("express");
const router = express.Router();

const editQuiz = (db) => {
  // the get request loads the page with the proper questions to edit
  router.get("/:id", (req, res) => {
    const session = req.session.id;
    //grabbing just the cover image for the entire quiz, not sure if image in question_answers is supposed to be different per question.
    const queryString = `SELECT quizzes.id, quizzes.cover_image_url, quizzes.title, quizzes.category, question_number, question, answer, choice_1, choice_2, choice_3, choice_4, questions_answers.id as questionID, image_url, ispublic
    FROM quizzes
    JOIN questions_answers ON quizzes.id = quiz_id
    WHERE quizzes.id = $1
    ORDER BY questions_answers.id;`;
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
    let isPublic = `FALSE`;
    if (!req.body.ispublic) {
      isPublic = `TRUE`;
    }
    console.log("HERE IS REQ BODY", req.body);

    let queryString = `UPDATE quizzes
    SET title = $1,
    cover_image_url = $2,
    ispublic = $3`;

    const queryValues = [quiz.title, quiz.cover_image_url, isPublic, quizID];

    // Will check to see if category has changed, if it has, it will add query and push value to array
    if (req.body.category) {
      queryString += `, category = $5`;
      queryValues.push(quiz.category);
    }

    queryString += `WHERE quizzes.id = $4;`;

    return db
      .query(queryString, queryValues)
      .then(() => {
        const type = typeof req.body.question;
        const length = (type === "string") ? 1 : req.body.question.length;
        for (let i = 0; i < length; i++) {
          let answer = (type === "string") ? req.body.answer: req.body.answer[i];
          let queryString = `UPDATE questions_answers
            SET question = $1,
            image_url = $2,
            choice_1 = $3,
            choice_2 = $4
            `;
          let queryValues = [];
          queryValues = [
            question = (type === "string") ? req.body.question: req.body.question[i],
            image_url = (type === "string") ? req.body.image_url: req.body.image_url[i],
            choice_1 = (type === "string") ?  req.body.choice_1: req.body.choice_1[i],
            choice_2 = (type === "string") ? req.body.choice_2: req.body.choice_2[i],
            questionid = (type === "string") ? req.body.questionid: req.body.questionid[i]
          ];

          console.log('answer', answer);

          // will check if there are more than 2 choices, and add the queries incrementally along with queryValues to array
          // because some questions have less than 2 choices, there is logic that checks if those choices exist in the ejs
          // if they don't the field is hidden and x is returned in order to create a better map of req.body
          // better as in easier to work with
          if (req.body.choice_3[i] !== "x") {
            queryString += `, choice_3 = $6`;
            const choice_3 = (type === "string") ? req.body.choice_3: req.body.choice_3[i];
            queryValues.push(choice_3);
          }
          if (req.body.choice_4[i] !== "x") {
            queryString += `, choice_4 = $7`;
            const choice_4 = (type === "string") ? req.body.choice_4: req.body.choice_4[i];
            queryValues.push(choice_4);
          }

          // will check the answer input against the choice,
          //and set the value to the exact same as the matching choice field
          // we adjust query accordingly and push value to array
          // if no value is passed, we assume user doesn't want to change answer
          // can refactor this into switch case
          if (answer === "choice1") {
            answer = queryValues[2];
            queryString += `, answer = $8 `;
            queryValues.push(answer);
          }
          if (answer === "choice2") {
            answer = queryValues[3];
            queryString += `, answer = $8 `;
            queryValues.push(answer);
          }
          if (answer === "choice3") {
            answer = queryValues[5];
            queryString += `, answer = $8 `;
            queryValues.push(answer);
          }
          if (answer === "choice4") {
            answer = queryValues[6];
            queryString += `, answer = $8 `;
            queryValues.push(answer);
          }
          queryString += `WHERE questions_answers.id = $5;`;

          console.log(queryString, queryValues);
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
