$(document).ready(function () {
  // Sidebar Toggle
  document
    .getElementById("sidebarToggle")
    .addEventListener("click", function () {
      const sidebar = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");

      sidebar.classList.toggle("show");
      backdrop.classList.toggle("show");
    });

  // Close sidebar when clicking backdrop
  document
    .getElementById("sidebarBackdrop")
    .addEventListener("click", function () {
      const sidebar = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");

      sidebar.classList.remove("show");
      backdrop.classList.remove("show");
    });

  // Initialize DataTables
  $(".data-table").DataTable({
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
  });
});

// SweetAlert Confirmation dialogs
function confirmDelete(url, title = "item") {
  Swal.fire({
    title: `Hapus ${title}?`,
    html: `<div class="text-center">
            <i class="fas fa-trash-alt fa-3x text-danger mb-3"></i><br>
            <strong>Apakah Anda yakin ingin menghapus ${title.toLowerCase()} ini?</strong><br>
            <small class="text-muted">Tindakan ini tidak dapat dibatalkan!</small>
        </div>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Batal",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // Show loading
      Swal.fire({
        title: "Menghapus...",
        text: `Sedang menghapus ${title.toLowerCase()}`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      window.location.href = url;
    }
  });
}

function confirmAction(
  url,
  title = "Tindakan",
  text = "Apakah Anda yakin?",
  confirmText = "Ya, Lanjutkan!"
) {
  Swal.fire({
    title: title,
    text: text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#f59e0b",
    cancelButtonColor: "#6b7280",
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // Show loading
      Swal.fire({
        title: "Memproses...",
        text: "Sedang memproses permintaan Anda",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      window.location.href = url;
    }
  });
}

function confirmLogout() {
  Swal.fire({
    title: "Logout?",
    text: "Apakah Anda yakin ingin keluar?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = baseUrl + "auth/logout";
    }
  });
}

// Fungsi untuk menampilkan pesan sukses
function showSuccess(message, title = "Berhasil!") {
  Swal.fire({
    icon: "success",
    title: title,
    text: message,
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: "top-end",
  });
}

// Fungsi untuk menampilkan pesan error
function showError(message, title = "Gagal!", details = null) {
  let html = message;
  if (details) {
    html += '<br><br><small class="text-muted">Detail: ' + details + "</small>";
  }

  Swal.fire({
    icon: "error",
    title: title,
    html: html,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Tutup",
    allowOutsideClick: false,
  });
}

// Fungsi untuk menampilkan pesan peringatan
function showWarning(message, title = "Peringatan!") {
  Swal.fire({
    icon: "warning",
    title: title,
    html: message,
    confirmButtonColor: "#f59e0b",
    confirmButtonText: "Mengerti",
  });
}

// Fungsi untuk menampilkan pesan info
function showInfo(message, title = "Informasi") {
  Swal.fire({
    icon: "info",
    title: title,
    html: message,
    confirmButtonColor: "#0ea5e9",
    confirmButtonText: "OK",
  });
}

// Fungsi untuk menampilkan error validasi
function showValidationError(errors, title = "Kesalahan Validasi!") {
  let errorHtml = '<ul class="text-left mb-0">';
  if (Array.isArray(errors)) {
    errors.forEach(function (error) {
      errorHtml += "<li>" + error + "</li>";
    });
  } else if (typeof errors === "object") {
    Object.keys(errors).forEach(function (field) {
      errorHtml +=
        "<li><strong>" + field + ":</strong> " + errors[field] + "</li>";
    });
  } else {
    errorHtml += "<li>" + errors + "</li>";
  }
  errorHtml += "</ul>";

  Swal.fire({
    icon: "error",
    title: title,
    html:
      '<div class="text-left"><strong>Silakan perbaiki kesalahan berikut:</strong><br><br>' +
      errorHtml +
      "</div>",
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Perbaiki",
    width: "500px",
  });
}
