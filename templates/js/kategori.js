$(document).ready(function () {
  // SweetAlert confirmation before submit
  $("form").on("submit", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Konfirmasi Simpan",
      text: "Apakah Anda yakin ingin menyimpan kategori ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        this.submit();
      }
    });
  });
});
