$(function () {

  $.get("/api/assets", data => {
    data.forEach(a => $("#issue_asset").append(`<option value="${a.id}">${a.serial_number}</option>`));
  });

  $.get("/api/employees", data => {
    data.forEach(e => $("#issue_employee").append(`<option value="${e.id}">${e.first_name} ${e.last_name || ''}</option>`));
  });

  $("#issueForm").submit(function (e) {
    e.preventDefault();

    $.post("/api/issue", {
      asset_id: $("#issue_asset").val(),
      employee_id: $("#issue_employee").val(),
      issue_date: $("#issue_date").val(),
    }, () => alert("Asset Issued"));
  });
});