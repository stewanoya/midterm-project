const express = require('express');
const router  = express.Router();



module.exports = (db) => {
  const insertQ = function(question, quiz_id) {
    let count = 1;
    console.log(question);

    while (question[`q${count}-question`]) {
      const questionArr = [quiz_id, question[`q${count}-image_url`],  question[`q${count}-question`],
      question[`q${count}-answer`], question[`q${count}-choice1`], question[`q${count}-choice2`],
      question[`q${count}-choice3`], question[`q${count}-choice4`]];

      db.query(`INSERT INTO questions_answers
      (quiz_id, image_url, question, answer, choice_1, choice_2, choice_3, choice_4)
      VALUES($1, $2, $3, $4 , $5, $6, $7, $8)`, questionArr);
        // .then(result => result.rows)
        // .catch(err => res.status(500).json({ error: err.message }));
      count++;
    }
  };

  router.post("/", (req, res) => {
    let quiz_id;
    const isPublic = req.body.public || false;
    db.query(`INSERT INTO quizzes (creator_id, title, isPublic, category, cover_image_url)
    VALUES($1, $2, $3, $4 , $5)
    RETURNING *;`,
    [2, req.body.title, isPublic, req.body.category,req.body.image_url])
      .then(result => result.rows[0])
      .then(row => insertQ(req.body, row.id))
      .catch(err => res.status(500).json({ error: err.message }));

    return res.redirect("/new-quiz");
  });

  router.get("/", (req, res) => {

    res.render("create-quiz");
  });

  return router;



};

