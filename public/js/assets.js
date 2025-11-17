$(function () {
  const table = $("#assetsTable").DataTable({
    ajax: "/api/assets",
    columns: [
      { data: "id" },
      { data: "serial_number" },
      { data: "type" },
      { data: "make", render: d => d || '' },
      { data: "status" },
      { data: "assigned_to" },
      {
        data: null,
        render: d => `
          <button class="btn btn-sm btn-primary edit" data-id="${d.id}">Edit</button>
          <button class="btn btn-sm btn-danger delete" data-id="${d.id}">Delete</button>
        `
      }
    ]
  });

  $("#btnAdd").click(() => {
    $("#assetForm")[0].reset();
    $("#assetModal").modal("show");
  });

  $("#assetForm").submit(function (e) {
    e.preventDefault();

    const id = $("#assetId").val();
    const data = {
      serial_number: $("#serial_no").val(),
      type: $("#category_id").val(),
      make: $("#make_model").val(),
      status: $("#status").val(),
      assigned_to: $("#assigned_to").val(),
    };

    $.ajax({
      url: id ? `/api/assets/${id}` : "/api/assets",
      type: id ? "PUT" : "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: () => {
        $("#assetModal").modal("hide");
        table.ajax.reload();
      }
    });
  });
});