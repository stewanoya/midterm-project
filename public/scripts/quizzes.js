
let question_index = 0;

const renderQuiz = function(questions) {
  $('.quizzes-container').empty();
  const total = questions.users.length;
  const $question = createQuestionElement(questions.users[question_index], total);
  $('.quizzes-container').append($question);
  question_index++;
};

const loadQuiz = function() {
  const path = (window.location.pathname).split('/');
  //console.log(path[2]);
  $.get(`/api/loadquiz/${path[2]}`).then(renderQuiz);
};

const createQuestionElement = function(question, total) {
  const path = (window.location.pathname).split('/');
  let btn = `<button id="next_question">Next</button>`;
  if (total === question_index+1) {
    btn = `
      <form action="/quizzes/score/${path[2]}" id="form_for_answer" method="POST">
        <input id="score" name="score" type="text" hidden/>
        <input id="quiz_id" name="quiz_id" type="text" value="${question.quiz_id}" hidden/>
        <button id="next_question">Finish</button>
      </from>`;
  }
  let c3 = '', c4 = '';
  if (question.choice_3) {
    c3 = `<p class="answers-quiz">${question.choice_3}</p>`;
  }
  if (question.choice_3) {
    c4 = `<p class="answers-quiz">${question.choice_4}</p>`;
  }

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
  loadQuiz();

  $(document.body).on('click', ".answers-quiz" ,function(){
  //$().on('click', function() {
    console.log("hello");
    const choice =  $(this).text();
    const answer = $(this).siblings(".correct-answer").val();

    $(this).siblings(".answers-quiz").click(false);
    console.log(choice, answer);
    if (choice == answer) {
      $(this).css({
        backgroundColor: "lime"
      });
      score++;

    } else {
      $(this).css({
        backgroundColor: "red"
      });
    }

    $("#score").val(score);
  });

  $(document.body).on('click', "#next_question" ,function(){
    loadQuiz();
  });
});
