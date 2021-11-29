// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
var cookieSession = require("cookie-session");
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
const registerUserRoutes = require("./routes/register");
const logoutRoutes = require("./routes/logout");
const loginRoutes = require("./routes/login");

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
app.use("/logout", logoutRoutes());
app.use("/login", loginRoutes(db));

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

app.get("/quizzes/:quizid", (req, res) => {
  let sqlQuery;
  let variables;

  if (req.query.questionid) {
    sqlQuery = `SELECT quizzes.category, quizzes.title, questions_answers.*
  FROM questions_answers
  JOIN quizzes ON quizzes.id = quiz_id
  WHERE quiz_id = $1
  AND questions_answers.id > $2
  LIMIT 1;`;

    variables = [req.params.quizid, req.query.questionid];
  } else {
    sqlQuery = `SELECT quizzes.category, quizzes.title, questions_answers.*
      FROM questions_answers
      JOIN quizzes ON quizzes.id = quiz_id
      WHERE quiz_id = $1
      LIMIT 1;`;

    variables = [req.params.quizid];
  }

  db.query(sqlQuery, variables)
    .then((data) => {
      const quiz = data.rows;
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

exports.db = db;
