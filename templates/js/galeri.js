document.addEventListener("DOMContentLoaded", function () {
  const foto = document.querySelector("#foto");
  const imgPreview = document.querySelector("#img-preview");

  if (foto && imgPreview) {
    foto.addEventListener("change", function () {
      const fileFoto = this.files[0];

      if (fileFoto) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileFoto);

        fileReader.onload = function (e) {
          imgPreview.src = e.target.result;
        };
      }
    });
  }
});

$(document).ready(function () {
  // Initialize Select2
  $(".select2").select2({
    theme: "bootstrap-5",
    placeholder: "-- pilih --",
    allowClear: true,
  });

  $("#formGaleri button[type='submit']").on("click", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Simpan Perubahan?",
      text: "Anda akan menyimpan perubahan pada data Galeri ini. \nPerubahan akan langsung diterapkan diseluruh data yang menggunakan Galeri Ini.",
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
        $("#formGaleri").submit();
      }
    });
  });
});
