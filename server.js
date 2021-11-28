// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

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

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const quizzesRoutes = require("./routes/quizzes");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
// app.use("/quizzes", quizzesRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.post("/new-quiz", (req, res) => {
  //console.log('hello');
  console.log(req.body);
  const isPublic = req.body.public || false;
  db.query(`INSERT INTO quizzes (creator_id, title, isPublic, category, cover_image_url)
  VALUES($1, $2, $3, $4 , $5)
  RETURNING *;`,
  [2, req.body.title, isPublic, req.body.category,req.body.image_url])
    .then(result => result.rows[0])
    .catch(err => console.error(err.message));
  return res.redirect("/new-quiz");
});


app.get("/", (req, res) => {
  db.query(`SELECT * from quizzes LIMIT 15;`)
    .then((data) => {
      const quizzes = data.rows;
      return quizzes;
    })
    .then((quizzes) => {
      const templateVars = { quizzes };
      res.render("index", templateVars);
    })
    .catch((err) => {
      console.log("this is the error", err.message);
      return err.message;
    });
});

app.get("/new-quiz", (req, res) => {
  res.render("create-quiz");
});

app.get("/quizzes/:quizid", (req, res) => {
  db.query(`SELECT quizzes.category, quizzes.title, questions_answers.*
  FROM questions_answers
  JOIN quizzes ON quizzes.id = quiz_id
  WHERE quiz_id = $1;`,
  [req.params.quizid])
    .then(data => {

      const quizzes = data.rows
      const templateVars = {
        quizzes
      };
      res.render( "quizzes", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
