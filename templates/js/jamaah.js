$(document).ready(function () {
  // Form submission confirmation
  $("#formJamaah button[type='submit']").on("click", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Simpan Perubahan?",
      text: "Anda akan menyimpan perubahan pada data Jamaah ini.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Simpan",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        $("#formHotel").submit();
      }
    });
  });
});
