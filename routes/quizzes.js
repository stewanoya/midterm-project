const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //displaying score //
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

  //quiz taking and incrementing score with correct answer//
  router.post("/:short_url", (req, res) => {
    sqlQuery = `SELECT questions_answers.* FROM questions_answers
      WHERE id = $1;`;

    sqlQuery2 = `INSERT INTO results (short_url, score, quiz_id, user_id)
      VALUES ($1, $2, $3, $4) RETURNING *`;

    db.query(sqlQuery, [req.body.questionid])
      .then((data) => {
        const question = data.rows[0];
        const answer = question.answer;

        if (answer == req.body.answer) {
          req.session.score = req.session.score + 1;
        }
        //if on last question redirect to results page //
        if (req.body.last_question === "true") {
          const user_id = req.session.id || 0;
          db.query(sqlQuery2, [
            req.params.short_url,
            req.session.score,
            req.session.quizid,
            user_id,
          ])
            .then((data) => {
              res.redirect(
                `/result/${data.rows[0].id}/${req.params.short_url}`
              );
              return;
            })
            .catch((err) => {
              res.status(500).json({ error: err.message });
            });
        } else {
          //if not on last question, redirect to next question //
          res.redirect(
            `/quizzes/${req.params.short_url}?questionid=${req.body.questionid}`
          );
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // get route for quiz //
  router.get("/:short_url", (req, res) => {
    let sqlQuery;
    let variables;

    if (req.query.questionid) {
      sqlQuery = `SELECT quizzes.category, quizzes.short_url, quizzes.id, quizzes.title, questions_answers.*,
        (SELECT COUNT(questions_answers.quiz_id)
        FROM questions_answers
        JOIN quizzes ON quizzes.id = quiz_id
        WHERE short_url = $1) as total

        FROM questions_answers
        JOIN quizzes ON quizzes.id = quiz_id
        WHERE short_url = $1
        AND questions_answers.id > $2
        ORDER BY questions_answers.id
        LIMIT 1;`;

      variables = [req.params.short_url, req.query.questionid];
    } else {
      req.session.score = 0;

      sqlQuery = `SELECT quizzes.category, quizzes.id, quizzes.short_url, quizzes.title, questions_answers.*,
        (SELECT COUNT(questions_answers.quiz_id)
        FROM questions_answers
        JOIN quizzes ON quizzes.id = quiz_id
        WHERE short_url = $1) as total

        FROM questions_answers
        JOIN quizzes ON quizzes.id = quiz_id
        WHERE short_url = $1
        ORDER BY questions_answers.id
        LIMIT 1;`;

      variables = [req.params.short_url];
    }

    db.query(sqlQuery, variables)
      .then((data) => {
        const quiz = data.rows;
        req.session.quizid = data.rows[0] ? data.rows[0].quiz_id : 0;
        const session = req.session.id;
        const templateVars = {
          quiz,
          session,
        };
        res.render("quizzes", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
