const express = require("express");
const router = express.Router();
const cookieSession = require("cookie-session");
const app = express();

app.use(
  cookieSession({
    name: "session",
    // shoutout to anyone that gets the reference
    keys: ["The Temp at Night."],
  })
);

module.exports = (db) => {
  router.get("/", (req, res) => {
    const session = req.session["id"];
    db.query(
      `SELECT * FROM quizzes
      WHERE (LOWER(title) LIKE LOWER($1) AND ispublic = 'TRUE')
      OR (LOWER(category) LIKE LOWER($1) AND ispublic = 'TRUE')
      LIMIT 15;`,
      [`%${req.query.search}%`]
    )
      .then((data) => {
        const quizzes = data.rows;
        return quizzes;
      })
      .then((quizzes) => {
        const templateVars = { quizzes, session };
        res.render("search-result", templateVars);
      })
      .catch((err) => {
        console.log("this is the error", err.message);
        return err.message;
      });
  });
  return router;
};
