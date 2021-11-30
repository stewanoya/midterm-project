// Client facing scripts here
$(document).ready(function () {
  $(`.search-button`).one("click", function (e) {
    e.preventDefault();
    $(this).unbind(e);
    $(`#search`).css("width", "80%");
  });
});
