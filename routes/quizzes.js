const express = require('express');
const router  = express.Router();


// router.get("/", (req, res) => {
//   db.query(`SELECT *
//   FROM questions_answers`)
//     .then(data => {

//       const quizzes = data.rows
//       const templateVars = {
//         quizzes
//       };
//       res.json({ quizzes })
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .json({ error: err.message });
//     });
//     return router;
// });
