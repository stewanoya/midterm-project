const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const insertQuestion = function(question, quiz_id) {
    let count = 1;

    // use loop to group the questions and insert into questions_answers table
    while (question[`q${count}-question`]) {
      const queryString = `INSERT INTO questions_answers
        (quiz_id, image_url, question, answer, choice_1, choice_2, choice_3, choice_4)
        VALUES($1, $2, $3, $4 , $5, $6, $7, $8)`;
      const queryParams = [quiz_id, question[`q${count}-image_url`],
        question[`q${count}-question`], question[`q${count}-answer`],
        question[`q${count}-choice1`], question[`q${count}-choice2`],
        question[`q${count}-choice3`], question[`q${count}-choice4`]];

      db.query(queryString, queryParams);

      count++;
    }
  };

  router.post("/", (req, res) => {
    const isPublic = req.body.public || false;
    const queryString = `INSERT INTO quizzes
      (creator_id, title, isPublic, category, cover_image_url)
      VALUES($1, $2, $3, $4 , $5) RETURNING *;`;
    // check 2 in user id when login is added
    const queryParams = [2, req.body.title, isPublic, req.body.category,req.body.image_url];

    // insert to the quiz table for the db
    db.query(queryString, queryParams)
      .then(result => result.rows[0])
      //call and send quiz_id for questions_answers table
      .then(row => insertQuestion(req.body, row.id))
      .catch(err => res.status(500).json({ error: err.message }));

    return res.redirect("/new-quiz");
  });

  router.get("/", (req, res) => {
    res.render("create-quiz");
  });

  return router;



};

