

$(function() {
  $(".answers-quiz").on('click', function() {
    const choice =  $(this).text();
    const answer = $(this).siblings(".correct-answer").val();

    $(this).siblings(".answers-quiz").off("click");
    $("#answer").val(choice);

    if (choice == answer) {


      $(this).css({
        backgroundColor: "lime"

      });

    } else {
      $(this).css({
        backgroundColor: "red"
      });

    }
  });
});
