// Client facing scripts here
$(document).ready(function () {
  $(`.search-button`).one("click", function (e) {
    e.preventDefault();
    $(`#search`).css("width", "80%");
  });
});
