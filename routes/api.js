/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const getApi = function(queryString, res) {
    db.query(queryString)
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  }

  router.get("/users", (req, res) => {
    getApi(`SELECT * FROM users;`, res);
  });
  router.get("/quizzes", (req, res) => {
    getApi(`SELECT * FROM quizzes;`, res);
  });
  router.get("/q_and_a", (req, res) => {
    getApi(`SELECT * FROM questions_answers;`, res);
  });
  router.get("/results", (req, res) => {
    getApi(`SELECT * FROM results;`, res);
  });

  // use for quizzes.js to get the question and answers
  router.get("/loadquiz/:short_url", (req, res) => {
    const queryString = `
      SELECT * FROM quizzes
      JOIN questions_answers ON quizzes.id = quiz_id
      WHERE short_url = '${req.params.short_url}';`
    getApi(queryString, res);
  });

  return router;
};
