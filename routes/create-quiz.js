const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    console.log("test3");
    console.log(req.body);
    const isPublic = req.body.public || false;
    db.query(`INSERT INTO quizzes (creator_id, title, isPublic, category, cover_image_url)
    VALUES($1, $2, $3, $4 , $5)
    RETURNING *;`,
    [2, req.body.title, isPublic, req.body.category,req.body.image_url])
      .then(result => result.rows[0])
      .catch(err => res.status(500).json({ error: err.message }));
    return res.redirect("/new-quiz");
  });

  router.get("/", (req, res) => {
    res.render("create-quiz");
  });

  return router;
};

