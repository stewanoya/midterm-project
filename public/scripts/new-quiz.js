const loadQuestions = function() {
  const $questions = createTweetElement();
  $('#question-container').append($questions);
};

const createTweetElement = function() {
  let $questions = `
    <article class="box">
      <header class="user">
        <div class="question">
          <a>Hekko</a>
        </div>
        <a class="userhandle">@h</a>
      </header>
      <p>text</p>
      <footer>
        <a>time</a>
        </div>
      </footer>
    </article>
  `;
  return $questions;
};

$(document).ready(function() {
  loadQuestions();

  $("#Add-more").submit(function(event) {
    event.preventDefault();
    loadQuestions();
    console.log('heelo from new quiz');
  });
});
