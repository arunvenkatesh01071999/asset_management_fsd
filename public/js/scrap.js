$(function () {
  $.get("/api/assets", data => {
    data.forEach(a => $("#scrap_asset").append(`<option value="${a.id}">${a.serial_number}</option>`));
  });

  $("#scrapForm").submit(function (e) {
    e.preventDefault();

    $.post("/api/scrap", {
      asset_id: $("#scrap_asset").val(),
      reason: $("#scrap_reason").val()
    }, () => alert("Scrapped"));
  });
});