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
  const menu = document.getElementById("myLinks");
  setTimeout(() => {
    menu.style.display = "none";
  }, 500);
}

function HamburgerMenu() {
  const menu = document.getElementById("myLinks");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

function submitform() {
  document.logout.submit();
}
