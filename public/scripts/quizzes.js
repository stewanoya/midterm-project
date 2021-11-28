$(function() {
$(".answers-quiz").on('click', function(){
  const x =  $(this).text()
  const answer = $("#correct-answer").val()

  console.log(x, answer);
  if (x == answer){
    // $(".answers-quiz").css({
    //   backgroundColor: "red"
    // })
    $(this).css({
      backgroundColor: "green"
    })


  } else {
    $(this).css({
      backgroundColor: "red"
    })
  }


})

})
