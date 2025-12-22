$(document).ready(function () {
  // Fetch cities from API
  $("#logActivityTable").DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      url: baseUrl + "profile/ajax-log-activity",
      type: "GET",
    },
    columns: [
      { data: "no", orderable: false, searchable: false },
      { data: "create_date" },
      { data: "route" },
      { data: "method", orderable: false },
      { data: "browser" },
      { data: "platform" },
      { data: "is_ajax", orderable: false, searchable: false },
    ],
    order: [[1, "desc"]],
    pageLength: 10,
    language: {
      processing: '<i class="fas fa-spinner fa-spin"></i> Loading...',
      emptyTable: "No activity logs found",
      zeroRecords: "No matching records found",
    },
  });
});
