$(function () {
  $("#stockTable").DataTable({
    ajax: "/api/stock",
    columns: [
      { data: "branch" },
      { data: "category" },
      { data: "count" },
      { data: "total_value" }
    ]
  });
});