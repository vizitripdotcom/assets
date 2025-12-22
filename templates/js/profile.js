$(document).ready(function () {
  $("#logActivityTable").DataTable({
    processing: true,
    serverSide: true,
    orderCellsTop: true,
    ajax: {
      url: baseUrl + "profile/ajax-log-activity",
      type: "POST",
    },
    initComplete: function (settings, json) {
      var indexColumn = 0;

      this.api()
        .columns()
        .every(function () {
          var column = this;
          var input = document.createElement("input");

          $(input)
            .attr("placeholder", "Search")
            .addClass("form-control form-control-sm")
            .appendTo($(".filterhead:eq(" + indexColumn + ")").empty())
            .on("keyup", function () {
              column.search($(this).val(), false, false, true).draw();
            });

          indexColumn++;
        });
    },
    columns: [
      {
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      { data: "route", name: "user_apps_activity.route" },
      { data: "method", name: "user_apps_activity.method" },
      { data: "browser", name: "user_apps_activity.browser" },
      { data: "platform", name: "user_apps_activity.platform" },
      { data: "isAjax", name: "user_apps_activity.is_ajax" },
      { data: "create_date", name: "user_apps_activity.create_date" },
    ],
    responsive: true,
    pageLength: 10,
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "All"],
    ],
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Search...",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      infoEmpty: "Showing 0 to 0 of 0 entries",
      infoFiltered: "(filtered from _MAX_ total entries)",
      zeroRecords: "No matching records found",
      emptyTable: "No data available in table",
      paginate: {
        first: "First",
        last: "Last",
        next: "Next",
        previous: "Previous",
      },
    },
    drawCallback: function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    },
  });
});
