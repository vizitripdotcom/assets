(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    // Image preview functionality
    const bannerImageInput = document.getElementById("banner_image");
    const imagePreview = document.getElementById("image-preview");
    const previewPlaceholder = document.getElementById("preview-placeholder");
    const btnHapusGambar = document.getElementById("btn-hapus-gambar");
    const form = document.getElementById("bannerPromoForm");

    bannerImageInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
          previewPlaceholder.style.display = "none";
          btnHapusGambar.style.display = "inline-block";
        };
        reader.readAsDataURL(file);
      }
    });

    btnHapusGambar.addEventListener("click", function () {
      bannerImageInput.value = "";
      imagePreview.src = "";
      imagePreview.style.display = "none";
      previewPlaceholder.style.display = "flex";
      btnHapusGambar.style.display = "none";
    });

    // Form validation
    form.addEventListener("submit", function (e) {
      if (bannerImageInput.files.length === 0) {
        e.preventDefault();
        alert("Harap upload gambar banner terlebih dahulu.");
        // Scroll to top or to the image section
        bannerImageInput.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });

    // Voucher toggle functionality with radio buttons
    const tipePromoRadios = document.querySelectorAll(
      'input[name="tipe_promo"]'
    );
    const voucherContainer = document.getElementById("voucher_container");
    const voucherSelect = document.getElementById("voucher_id");

    function toggleVoucher() {
      const selectedTipe = document.querySelector(
        'input[name="tipe_promo"]:checked'
      );
      if (selectedTipe && selectedTipe.value === "Voucher") {
        voucherContainer.style.display = "block";
        voucherSelect.setAttribute("required", "required");
      } else {
        voucherContainer.style.display = "none";
        voucherSelect.removeAttribute("required");
        voucherSelect.value = "";
      }
    }

    tipePromoRadios.forEach((radio) => {
      radio.addEventListener("change", toggleVoucher);
    });

    // Run on load to set initial state (e.g. if validation failed and we have old input)
    toggleVoucher();
  });
})();
