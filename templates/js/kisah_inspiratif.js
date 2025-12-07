/**
 * Kisah Inspiratif JavaScript Functions
 * Handles image preview functionality
 */

$(document).ready(function () {
  // Image Upload Click Trigger
  $(".image-upload-wrapper").on("click", function () {
    $("#gambar").click();
  });

  // Image Preview
  $("#gambar").on("change", function () {
    const file = this.files[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran file terlalu besar! Maksimum 2MB.");
        this.value = "";
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("Format file tidak valid! Hanya JPG dan PNG yang diperbolehkan.");
        this.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        $("#preview-image").attr("src", e.target.result).show();
        $(".image-upload-wrapper i, .image-upload-wrapper p").hide();
      };
      reader.readAsDataURL(file);
    }
  });

  // SweetAlert confirmation before submit
  $("form").on("submit", function (e) {
    e.preventDefault();

    Swal.fire({
      title: "Konfirmasi Simpan",
      text: "Apakah Anda yakin ingin menyimpan kisah inspiratif ini?",
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
