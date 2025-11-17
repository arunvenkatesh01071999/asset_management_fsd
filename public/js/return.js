$(function () {

  $.get("/api/assets", data => {
    data.forEach(a => $("#return_asset").append(`<option value="${a.id}">${a.serial_number}</option>`));
  });

  $("#returnForm").submit(function (e) {
    e.preventDefault();

    $.post("/api/return", {
      asset_id: $("#return_asset").val(),
      return_date: $("#return_date").val(),
      reason: $("#return_reason").val(),
    }, () => alert("Returned"));
  });
});