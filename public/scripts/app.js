// Client facing scripts here
$(document).ready(function () {
  searchAnimation();
});

const searchAnimation = () => {
  $(`.search-button`).one("click", function (e) {
    e.preventDefault();
    $(this).unbind(e);
    $(`#search`).css("width", "80%");
  });
};
