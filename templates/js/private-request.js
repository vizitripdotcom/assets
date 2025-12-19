var table;

$(document).ready(function () {
  // Initialize DataTables
  table = $("#table-request").DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      url: baseUrl + "/transaksi/private-request/list",
      type: "POST",
      data: function (d) {
        // Read active filter button
        d.status = $(".filter-status.active").data("status");
      },
    },
    columns: [
      { data: "no", orderable: false, searchable: false },
      { data: "nama" },
      { data: "kontak" },
      { data: "jenis_perjalanan" },
      { data: "destinasi_tour" },
      { data: "jumlah_pax" },
      { data: "status" },
      { data: "action", orderable: false, searchable: false },
    ],
    order: [[6, "desc"]], // Default sort by created_at (id roughly correlates)
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Cari Nama...",
    },
  });

  // Custom Filters
  $(".filter-status").click(function () {
    $(".filter-status").removeClass("active");
    $(this).addClass("active");
    table.ajax.reload();
  });
});

function showDetail(id) {
  $.getJSON(baseUrl + "/transaksi/private-request/show/" + id, function (res) {
    if (res.status) {
      var data = res.data;
      var html = `
                <table class="table table-borderless">
                    <tr><td width="30%">ID</td><td>: ${data.id}</td></tr>
                    <tr><td>Nama</td><td>: ${data.nama}</td></tr>
                    <tr><td>Kontak</td><td>: ${data.kontak}</td></tr>
                    <tr><td>Jenis Perjalanan</td><td>: ${
                      data.jenis_perjalanan
                    }</td></tr>
                    <tr><td>Destinasi</td><td>: ${
                      data.destinasi_tour || "-"
                    }</td></tr>
                    <tr><td>Pax</td><td>: ${data.jumlah_pax}</td></tr>
                    <tr><td>Status</td><td>: ${data.status}</td></tr>
                    <tr><td>Keterangan</td><td>: ${
                      data.keterangan || "-"
                    }</td></tr>
                    <tr><td>Tanggal Request</td><td>: ${
                      data.created_at
                    }</td></tr>
                </table>
            `;
      $("#modalDetailContent").html(html);
      $("#modalDetail").modal("show");
    } else {
      Swal.fire("Error", res.message, "error");
    }
  });
}

function updateStatus(id, status) {
  Swal.fire({
    title: "Ubah Status",
    text: `Ubah status menjadi ${status}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Ubah",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      $.post(
        baseUrl + "/transaksi/private-request/update-status",
        { id: id, status: status },
        function (res) {
          if (res.status) {
            Swal.fire("Berhasil", res.message, "success");
            table.ajax.reload(null, false);
          } else {
            Swal.fire("Gagal", res.message, "error");
          }
        }
      );
    }
  });
}
