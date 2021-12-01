
let questionsAnswered = false;

$(function() {
  $(".answers-quiz").on('click', function(){
    const choice =  $(this).text()
    const answer = $(this).siblings(".correct-answer").val()

    $(this).siblings(".answers-quiz").off("click");
    $("#answer").val(choice);

    questionsAnswered = true;

    if (choice == answer){


      $(this).css({
        backgroundColor: "lime"

      })

    } else {
      $(this).css({
        backgroundColor: "red"
      })

    }
  })
  })


//   const nextQuestion = function(shorturl, quizid, last_question){
//     console.log($("#last-question").val());

//     if (questionsAnswered === true){
//        questionsAnswered = false;
//        window.location.href = `/quizzes/${shorturl}?questionid=${quizid}`


//   } else {
//     $("#errormsg")
//         .slideDown("slow");
//   };

// }

    // $("#next_question").on('click', function()
    // {

    //   if (questionsAnswered === true){

    //   }$.ajax({
    //     method: "POST",
    //     url:
    //   })




    // }







  // $(function() {
  //   $(".next-btn").on('click', function(){
  //     const choice =  $(this).text()
  //     const answer = $(this).siblings(".correct-answer").val()

  //     $(this).siblings(".answers-quiz").off("click");

  //     questionid =

  //   })

  // $("#submitQuiz").submit(function (event) {
  //   event.preventDefault();
