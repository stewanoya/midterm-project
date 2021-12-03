const express = require("express");
const router = express.Router();

module.exports = (db) => {

  //gets the score from the user and insert into the db //
  router.post("/score/:short_url", (req, res) => {
    console.log("body->", req.body);
    const queryString = `INSERT INTO results (short_url, score, quiz_id, user_id)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const user_id = req.session.id || 0;
    const queryValues = [req.params.short_url, req.body.score,
      req.body.quiz_id, user_id,];

    console.log(queryString, queryValues);
    db.query(queryString, queryValues)
      .then((data) => {
        // if inserted then redirect to results card
        return res.redirect(`/result/${data.rows[0].id}/${req.params.short_url}`);
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });

  });

  router.get("/:short_url/results", (req, res) => {
    sqlQuery = `SELECT COUNT(*)
      FROM questions_answers
      WHERE quiz_id IN (SELECT id FROM quizzes WHERE short_url =$1);`;

    db.query(sqlQuery, [req.params.short_url]).then((data) => {
      const score = req.session.score;
      const total = data.rows[0].count;
      const templateVars = {
        score,
        session: req.session.id,
        total,
      };

      res.render("quiz-results", templateVars);
    });
  });


  // get route for quiz //
  router.get("/:short_url", (req, res) => {
    const session = req.session.id;
    const templateVars = { session };
    return res.render("quizzes", templateVars);
  });

  return router;
};
