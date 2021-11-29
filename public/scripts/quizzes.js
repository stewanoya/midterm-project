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
