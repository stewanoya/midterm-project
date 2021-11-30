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

const myQuizzes = (db) => {
  router.get("/", (req, res) => {
    const session = req.session.id;
    const templateVars = { session };
    res.render("my-quizzes", templateVars);
  });

  return router;
};

module.exports = myQuizzes;
