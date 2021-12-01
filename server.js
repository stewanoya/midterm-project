// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
let cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

app.use(
  cookieSession({
    name: "session",
    // shoutout to anyone that gets the reference
    keys: ["The Temp at Night."],
  })
);
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const quizzesRoutes = require("./routes/quizzes");
const createquizRoutes = require("./routes/create-quiz");
const widgetsRoutes = require("./routes/widgets");
const searchRoutes = require("./routes/search");
const registerUserRoutes = require("./routes/register");
const logoutRoutes = require("./routes/logout");
const loginRoutes = require("./routes/login");
const myQuizzesRoutes = require("./routes/my-quizzes");
const myResultsRoutes = require("./routes/my-results");
const deleteQuizRoutes = require("./routes/delete-quiz");
const editQuizRoutes = require("./routes/edit-quiz");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api", usersRoutes(db));
// app.use("/quizzes", quizzesRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.use("/new-quiz", createquizRoutes(db));
app.use("/register", registerUserRoutes(db));
app.use("/search", searchRoutes(db));
app.use("/logout", logoutRoutes());
app.use("/login", loginRoutes(db));
app.use("/my-quizzes", myQuizzesRoutes(db));
app.use("/my-results", myResultsRoutes(db));
app.use("/delete/", deleteQuizRoutes(db));
app.use("/edit/", editQuizRoutes(db));

app.get("/", (req, res) => {
  const session = req.session["id"];
  db.query(`SELECT * from quizzes LIMIT 15;`)
    .then((data) => {
      const quizzes = data.rows;
      return quizzes;
    })
    .then((quizzes) => {
      const templateVars = { quizzes, session };
      res.render("index", templateVars);
    })
    .catch((err) => {
      console.log("this is the error", err.message);
      return err.message;
    });
});


//displaying score //

app.get("/quizzes/:short_url/results", (req, res) => {

  sqlQuery = `SELECT COUNT(*)
  FROM questions_answers
  WHERE quiz_id IN (SELECT id FROM quizzes WHERE short_url =$1);`;

  db.query(sqlQuery, [req.params.short_url])
  .then((data) => {

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
app.post("/quizzes/:short_url", (req, res) => {
  sqlQuery = `SELECT questions_answers.* FROM questions_answers
  WHERE id = $1
  ;`;

  sqlQuery2 = `INSERT INTO results (short_url, score, quiz_id, user_id)
  VALUES ($1, $2, $3, $4)`

  db.query(sqlQuery, [req.body.questionid])
    .then((data) => {
      const question = data.rows[0];
      const answer = question.answer;

      if (answer == req.body.answer) {
        req.session.score = req.session.score + 1;
      }
        //if on last question redirect to results page //
      if (req.body.last_question === "true") {

        console.log("testingggg", [req.params.short_url, req.session.score, req.body.questionid, 1])

        db.query(sqlQuery2, [req.params.short_url, req.session.score, req.session.quizid, req.session.id])

        .then(() => {
          console.log("???sajdkajsd");
          res.redirect(`/quizzes/${req.params.short_url}/results`);
          return;

        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });

      } else {//if not on last question, redirect to next question //

      res.redirect(`/quizzes/${req.params.short_url}?questionid=${req.body.questionid}`);
      };

    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});


// get route for quiz //
app.get("/quizzes/:short_url", (req, res) => {
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

      console.log("finding data.rows", data.rows)
      req.session.quizid = data.rows[0] ? data.rows[0].quiz_id: 0;
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


//storing results after quiz-taking in my-reselts page //

// app.post("/:quiz_id/results/:user_id", (req, res) => {
//   const resultsInfo = req.body;
//   conso

//   sqlQuery = (`INSERT INTO results (score, short_url, user_id) VALUES ($1, $2) RETURNING *;
//   `, [req.params.short_url, req.params.userid])


// }


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

exports.db = db;
