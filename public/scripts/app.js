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

function LeaveNav() {
  setTimeout(() => {
    $( "#myLinks" ).hide('fast');
  }, 500);
}

function HamburgerMenu() {
  $( "#myLinks" ).toggle('fast');
}

function submitform() {
  document.logout.submit();
}
