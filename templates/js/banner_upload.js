// Banner Upload - Individual Boxes (5 boxes with 19:6 ratio)
$(document).ready(function () {
  $(".banner-file-input").each(function () {
    $(this).on("change", function () {
      const file = this.files[0];
      const $box = $(this).closest(".banner-upload-box");
      const $img = $box.find(".banner-img");
      const $placeholder = $box.find(".banner-placeholder");
      const $removeBtn = $box.find(".banner-remove-btn");

      if (file) {
        // Validate size
        if (file.size > 2048 * 1024) {
          alert("File terlalu besar. Maksimum 2MB");
          this.value = "";
          return;
        }

        // Validate type
        if (!file.type.match("image/(jpeg|png)")) {
          alert("Format harus JPG atau PNG");
          this.value = "";
          return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function (e) {
          $img.attr("src", e.target.result).show();
          $placeholder.hide();
          $removeBtn.show(); // Show remove button
        };
        reader.readAsDataURL(file);
      }
    });
  });

  // Handle remove button click
  $(document).on("click", ".banner-remove-btn", function (e) {
    e.stopPropagation(); // Prevent triggering file input
    const $box = $(this).closest(".banner-upload-box");
    const $img = $box.find(".banner-img");
    const $placeholder = $box.find(".banner-placeholder");
    const $fileInput = $box.find(".banner-file-input");

    // Clear the file input
    $fileInput.val("");

    // Hide image and remove button, show placeholder
    $img.hide().attr("src", "");
    $(this).hide();
    $placeholder.show();
  });
});
