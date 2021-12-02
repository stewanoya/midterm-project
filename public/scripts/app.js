// Client facing scripts here
$(document).ready(function () {
  $(`.search-button`).css("display", "inline");

  searchAnimation();
});

const searchAnimation = () => {
  $(`.search-button`).one("click", function (e) {
    e.preventDefault();
    $(this).unbind(e);
    $(`#search`).css("width", "80%");
  });
};

const LeaveNav = function() {
  setTimeout(() => {
    $( "#myLinks" ).hide('fast');
  }, 500);
}

const HamburgerMenu = function() {
  $( "#myLinks" ).toggle('fast');
}

const submitform = function() {
  document.logout.submit();
}

const clipboard = function(id) {
  const clipboardText = document.getElementById(`copylink${id}`);

  clipboardText.select();
  clipboardText.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(clipboardText.value);
}
