// quizzes.js

let question_index = 0;

// delete the last question and append the next set and questions
const renderQuiz = function(questions) {
  const total = questions.users.length;
  if (question_index < total) {
    $('.quizzes-container').empty();
    const $question = createQuestionElement(questions.users[question_index], total);
    $('.quizzes-container').append($question);
    question_index++;
  }
};

// get the api obj for a quiz and g
const loadQuiz = function() {
  const path = (window.location.pathname).split('/');
  $.get(`/api/loadquiz/${path[2]}`).then(renderQuiz);
};

// builds up the html elements
const createQuestionElement = function(question, total) {
  const path = (window.location.pathname).split('/');
  // if last question add form into the button
  let btn = `<button id="next_question">Next</button>`;
  if (total === question_index+1) {
    btn = `
      <form action="/quizzes/score/${path[2]}" id="form_for_answer" method="POST">
        <input id="score" name="score" type="text" hidden/>
        <input id="quiz_id" name="quiz_id" type="text" value="${question.quiz_id}" hidden/>
        <button id="next_question">Finish</button>
      </from>`;
  }

  // check if choice 3 and 4 is null before pull is in
  let c3 = '', c4 = '';
  if (question.choice_3) {
    c3 = `<p class="answers-quiz">${question.choice_3}</p>`;
  }
  if (question.choice_3) {
    c4 = `<p class="answers-quiz">${question.choice_4}</p>`;
  }

  // the main quiz layout
  let $question = `
    <div class="quiz">
      <p class="category-quiz">${question.category} - Question ${question.question_number} / ${total}</p>
      <div class="img-div-quiz">
        <img src="${question.image_url}" width="200" height="200" />
      </div>

      <input class="correct-answer" value="${question.answer}" type=hidden>
      <p class= "question-quiz">${question.question}</p>

      <p class="answers-quiz" id='q1'>${question.choice_1}</p>
      <p class="answers-quiz">${question.choice_2}</p>
      ${c3}
      ${c4}

      <div class="controls">
        ${btn}
      </div>

    </div>
  `;

  return $question;
};

$(function() {
  let score = 0;
  // for first time on load
  loadQuiz();

  // pick a choice
  $(document.body).on('click', ".answers-quiz" ,function(){
    const choice =  $(this).text();
    const answer = $(this).siblings(".correct-answer").val();

    //lock all button
    $(this).siblings(".answers-quiz").click(false);

    // change color if user click on a choice
    if (choice == answer) {
      $(this).css({ backgroundColor: "lime" });
      score++;
    } else {
      $(this).css({ backgroundColor: "red" });
    }

    // put the current score into the html
    $("#score").val(score);
  });

  // change to next question and results
  $(document.body).on('click', "#next_question" ,function(){
    loadQuiz();
  });
});
