const loadQuestions = function (questionNum) {
  const $questions = createQuestionElement(questionNum);
  $("#question-container").append($questions);
};

const createQuestionElement = function (num) {
  let $questions = `
    <article class="q${num}-box" id='q${num}'>
      <div class='info'>
        <label for="q${num}-question">Question ${num}: </label>
        <input type="text" id="q${num}-question" name="q${num}-question" required>

        <label for="q${num}-image_url">Image URL: </label>
        <input type="url" id="q${num}-image_url" name="q${num}-image_url" placeholder='example.com/image.png'>

        <label for="q${num}-answer">Answer: </label>
        <select id="q${num}-answer" name="q${num}-answer">
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
      </div>

      <div class='choices'>
        <label for="q${num}-choice1">A: </label>
        <input type="text" id="q${num}-choice1" name="q${num}-choice1" required><br>
        <label for="q${num}-choice2">B: </label>
        <input type="text" id="q${num}-choice2" name="q${num}-choice2" required><br>

        <label for="q${num}-choice3">C: </label>
        <input type="text" id="q${num}-choice3" name="q${num}-choice3"><br>
        <label for="q${num}-choice4">D: </label>
        <input type="text" id="q${num}-choice4" name="q${num}-choice4"><br><br>
      </div>
    </article>
  `;
  return $questions;
};

$(document).ready(function () {
  let questionNum = 1;

  loadQuestions(questionNum);
  questionNum++;

  $("#Add-more").submit(function (event) {
    event.preventDefault();
    loadQuestions(questionNum);
    questionNum++;
  });

  $("#Delete-one").submit(function (event) {
    event.preventDefault();
    if (questionNum > 2) {
      const deleteQ = document.getElementById(`q${questionNum - 1}`);
      deleteQ.remove();
      questionNum--;
    }
  });
});
