/**
 * Admin Layout Scripts
 * Handles sidebar toggling, state restoration, and flash message display
 */

// Toggle Sidebar Collapse (Desktop)
// Apply collapsed state immediately to prevent FOUC (Flash of Unstyled Content)
(function () {
  try {
    if (localStorage.getItem("sidebarCollapsed") === "true") {
      document.getElementById("sidebar").classList.add("collapsed");
    }
  } catch (e) {
    console.error("Error restoring sidebar state:", e);
  }
})();

function toggleSidebar(event) {
  event.preventDefault();
  const sidebar = document.getElementById("sidebar");
  const icon = event.currentTarget.querySelector(".collapse-icon");

  // Add transition class if not present
  if (!sidebar.style.transition) {
    sidebar.style.transition = "all 0.3s ease";
  }

  sidebar.classList.toggle("collapsed");

  // Rotate icon when collapsed
  if (sidebar.classList.contains("collapsed")) {
    icon.style.transform = "rotate(180deg)";
    localStorage.setItem("sidebarCollapsed", "true");
  } else {
    icon.style.transform = "rotate(0deg)";
    localStorage.setItem("sidebarCollapsed", "false");
  }
}

$(document).ready(function () {
  // Restore sidebar icon state
  const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (isCollapsed) {
    const icon = document.querySelector(".collapse-icon");
    if (icon) {
      icon.style.transform = "rotate(180deg)";
    }
  }

  // Process Flash Messages from Window Object
  if (typeof window.flashData !== "undefined") {
    processFlashMessages(window.flashData);
  }
});

function processFlashMessages(data) {
  // Helper to escape HTML to prevent XSS
  const escapeHtml = (unsafe) => {
    if (!unsafe) return "";
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Success
  if (data.success) {
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: data.success,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  }

  // Errors (Session errors array)
  if (data.errors) {
    let errorListHtml = "<ul>";
    if (Array.isArray(data.errors)) {
      data.errors.forEach((error) => {
        errorListHtml += "<li>" + escapeHtml(error) + "</li>";
      });
    } else if (typeof data.errors === "object") {
      Object.values(data.errors).forEach((error) => {
        errorListHtml += "<li>" + escapeHtml(error) + "</li>";
      });
    } else {
      errorListHtml += "<li>" + escapeHtml(data.errors) + "</li>";
    }
    errorListHtml += "</ul>";

    Swal.fire({
      icon: "error",
      title: "Gagal!",
      html: errorListHtml,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Tutup",
      allowOutsideClick: false,
    });
  }

  // Warning
  if (data.warning) {
    Swal.fire({
      icon: "warning",
      title: "Peringatan!",
      html: data.warning,
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Mengerti",
    });
  }

  // Info
  if (data.info) {
    Swal.fire({
      icon: "info",
      title: "Informasi",
      html: data.info,
      confirmButtonColor: "#0ea5e9",
      confirmButtonText: "OK",
    });
  }

  // Validation Errors (Legacy/Other variable $errors)
  if (data.validationErrors && data.validationErrors.length > 0) {
    let errorHtml = '<ul class="text-left mb-0">';
    data.validationErrors.forEach(function (error) {
      errorHtml += "<li>" + escapeHtml(error) + "</li>";
    });
    errorHtml += "</ul>";

    Swal.fire({
      icon: "error",
      title: "Kesalahan Validasi!",
      html:
        '<div class="text-left"><strong>Silakan perbaiki kesalahan berikut:</strong><br><br>' +
        errorHtml +
        "</div>",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Perbaiki",
      width: "500px",
    });
  }

  // DB Error
  if (data.dbError) {
    Swal.fire({
      icon: "error",
      title: "Kesalahan Database!",
      html:
        '<div class="text-left"><strong>Terjadi kesalahan pada database:</strong><br><br>' +
        escapeHtml(data.dbError) +
        "</div>",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Tutup",
      footer:
        '<small class="text-muted">Jika masalah berlanjut, hubungi administrator sistem</small>',
    });
  }

  // Permission Denied
  if (data.permissionDenied) {
    Swal.fire({
      icon: "warning",
      title: "Akses Ditolak!",
      html:
        '<div class="text-center"><i class="fas fa-shield-alt fa-3x text-warning mb-3"></i><br><strong>' +
        escapeHtml(data.permissionDenied) +
        "</strong></div>",
      confirmButtonColor: "#f59e0b",
      confirmButtonText: "Mengerti",
      footer:
        '<small class="text-muted">Hubungi administrator jika Anda memerlukan akses ini</small>',
    });
  }
}
