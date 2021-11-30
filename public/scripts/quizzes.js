<<<<<<< HEAD
$(function() {
$(".answers-quiz").on('click', function(){
  const choice =  $(this).text()
  const answer = $(this).siblings(".correct-answer").val()

  $(this).siblings(".answers-quiz").off("click");


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



// $(function() {
//   $(".next-btn").on('click', function(){
//     const choice =  $(this).text()
//     const answer = $(this).siblings(".correct-answer").val()

//     $(this).siblings(".answers-quiz").off("click");

//     questionid =






//   })
//   })
=======
$(function () {
  $(".answers-quiz").on("click", function () {
    const choice = $(this).text();
    const answer = $(this).siblings(".correct-answer").val();

    $(this).siblings(".answers-quiz").off("click");

    if (choice == answer) {
      $(this).css({
        backgroundColor: "lime",
      });
    } else {
      $(this).css({
        backgroundColor: "red",
      });
    }
  });
});
>>>>>>> 5a365ef398c33cbf780a8b0005fad51326494a32
