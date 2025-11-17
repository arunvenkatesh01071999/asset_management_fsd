$(function () {
  $("#historySearch").submit(function (e) {
    e.preventDefault();

    const q = $("#historyInput").val();

    $.get(`/api/history?q=${q}`, data => {
      $("#historyList").empty();

      data.forEach(item => {
        $("#historyList").append(`
          <li class="list-group-item">
            <b>${item.event}</b> - ${item.date}<br>
            ${item.details || ''}
          </li>
        `);
      });
    });
  });
});