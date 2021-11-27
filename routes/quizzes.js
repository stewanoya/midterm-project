//eventually want to seperate the get quizzes function to this file

const { Router } = require("express");
const express = require("express");
const router = express.Router();

//function to get all quizzes
const allQuizzes = (db) => {
  router.get("/", (req, res) => {
    //should change this to only show ACTIVE quizzes
    db.query(`SELECT * from quizzes;`)
      .then((data) => {
        const quizzes = data.rows;
        console.log("THIS SHOULD SHOW ALL TEST QUIZZES", quizzes);
        return quizzes;
        //this for some reason, replaces index with JSON data with the quiz, got it from andy's lecture
        // res.json({ quizzes });
      })
      .then((quizzes) => {
        const templateVars = { quizzes };
        console.log("here is templateVars", templateVars);
        res.render("index", templateVars);
      })
      .catch((err) => {
        console.log("this is the error", err.message);
        return err.message;
      });
  });

  return router;
};

module.exports = allQuizzes;
