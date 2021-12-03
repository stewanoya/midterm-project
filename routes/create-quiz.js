const express = require("express");
const router = express.Router();
const generateRandomString = require("../helpers/generateRandomString.js");

module.exports = (db) => {
  // this gets call when quiz get inserted into the db
  // it add each question one by one
  const insertQuestion = function (question, quiz_id) {
    let count = 1;
    const img_url =
      question[`q${count}-image_url`] ||
      "https://source.unsplash.com/random/400×400/?studying";

    // use loop to group the questions and insert into questions_answers table
    while (question[`q${count}-question`]) {
      let answer;
      switch (question[`q${count}-answer`]) {
        case "a":
          answer = question[`q${count}-choice1`];
          break;
        case "b":
          answer = question[`q${count}-choice2`];
          break;
        case "c":
          answer = question[`q${count}-choice3`];
          break;
        case "d":
          answer = question[`q${count}-choice4`];
          break;
      }

      // setup query values
      const queryString = `INSERT INTO questions_answers
        (quiz_id, image_url, question, question_number, answer, choice_1, choice_2, choice_3, choice_4)
        VALUES($1, $2, $3, $4 , $5, $6, $7, $8, $9)`;
      const queryParams = [
        quiz_id,
        img_url,
        question[`q${count}-question`],
        count,
        answer,
        question[`q${count}-choice1`],
        question[`q${count}-choice2`],
        question[`q${count}-choice3`],
        question[`q${count}-choice4`],
      ];

      db.query(queryString, queryParams);

      count++;
    }
  };

  router.post("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.status(304).redirect("/login");
    }

    // get some default values
    const isPublic = req.body.public || true;
    const img_url =
      req.body.image_url ||
      "https://source.unsplash.com/random/400×400/?studying";
    const queryString = `INSERT INTO quizzes
      (creator_id, title, short_url, isPublic, category, cover_image_url)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`;
    const queryParams = [
      session,
      req.body.title,
      generateRandomString(),
      isPublic,
      req.body.category,
      img_url,
    ];

    // console.log(queryString, queryParams);

    // insert to the quiz table for the db
    db.query(queryString, queryParams)
      .then((result) => result.rows[0])
      .then((row) => {
        console.log(req.body, row.id);
        insertQuestion(req.body, row.id);
      }) //call and send quiz_id for questions_answers table
      .catch((err) => res.status(500).json({ error: err.message }));

    return res.redirect("/my-quizzes");
  });

  // gets the create quiz from page
  router.get("/", (req, res) => {
    const session = req.session.id;

    if (!session) {
      res.status(304).redirect("/login");
    }
    const templateVars = { session };
    return res.render("create-quiz", templateVars);
  });

  return router;
};
