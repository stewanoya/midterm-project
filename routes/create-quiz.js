const express = require("express");
const router = express.Router();
const generateRandomString = require("../helpers/generateRandomString.js");

module.exports = (db) => {
  const insertQuestion = function (question, quiz_id) {
    let count = 1;

    console.log(question);

    // use loop to group the questions and insert into questions_answers table
    while (question[`q${count}-question`]) {
      const queryString = `INSERT INTO questions_answers
        (quiz_id, image_url, question, question_number, answer, choice_1, choice_2, choice_3, choice_4)
        VALUES($1, $2, $3, $4 , $5, $6, $7, $8, $9)`;
      const queryParams = [quiz_id, question[`q${count}-image_url`],
        question[`q${count}-question`], count,
        question[`q${count}-answer`],
        question[`q${count}-choice1`], question[`q${count}-choice2`],
        question[`q${count}-choice3`], question[`q${count}-choice4`]];

      db.query(queryString, queryParams);

      count++;
    }
  };

  router.post("/", (req, res) => {
    const isPublic = req.body.public || false;
    const queryString = `INSERT INTO quizzes
      (creator_id, title, short_url, isPublic, category, cover_image_url)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;
    // check 2 in user id when login is added
    const queryParams = [
      2,
      req.body.title,
      generateRandomString(),
      isPublic,
      req.body.category,
      req.body.image_url,
    ];

    console.log(queryString, queryParams);

    // insert to the quiz table for the db
    db.query(queryString, queryParams)
      .then((result) => result.rows[0])
      .then((row) => {
        console.log(req.body, row.id);
        insertQuestion(req.body, row.id);
      })   //call and send quiz_id for questions_answers table
      .catch((err) => res.status(500).json({ error: err.message }));

    return res.redirect("/");
  });

  router.get("/", (req, res) => {
    const session = req.session.id;
    const templateVars = { session };
    return res.render("create-quiz", templateVars);
  });

  return router;
};
