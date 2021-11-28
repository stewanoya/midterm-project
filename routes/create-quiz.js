const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const isPublic = req.body.public || false;
    db.query(`INSERT INTO quizzes (creator_id, title, isPublic, category, cover_image_url)
    VALUES($1, $2, $3, $4 , $5)
    RETURNING *;`,
    [2, req.body.title, isPublic, req.body.category,req.body.image_url])
      .then(result => {
        console.log(result.rows[0]);
        return result.rows[0];
      })
      .catch(err => res.status(500).json({ error: err.message }));

/*
    let count = 1;
    const id = db.query(`SELECT id FROM quizzes ORDER BY id DESC LIMIT 1;`)
      .then(result => result.rows[0].id);
    console.log(id);

    const questionArr = [];
    while (req.body[`q${count}-question`]) {
      count++;
    } */

    return res.redirect("/new-quiz");
  });

  router.get("/", (req, res) => {

    res.render("create-quiz");
  });

  return router;
};

