$(document).ready(function () {
  const $jenisDiskon = $("#jenis_diskon");
  const $diskon = $("#diskon");
  const $diskonLabel = $('label[for="diskon"]');

  // Add spinner to label
  const spinner = $(
    '<div class="spinner-border spinner-border-sm text-primary ms-2 d-none" role="status" id="diskon-spinner"><span class="visually-hidden">Loading...</span></div>'
  );
  $diskonLabel.append(spinner);

  // Initial state check
  if (!$jenisDiskon.val()) {
    $diskon.prop("disabled", true);
    $diskon.attr("placeholder", "Pilih jenis diskon terlebih dahulu");
  }

  $jenisDiskon.change(function () {
    const jenisDiskonVal = $(this).val();

    // Show loading state
    $jenisDiskon.prop("disabled", true);
    $diskon.prop("disabled", true);
    $("#diskon-spinner").removeClass("d-none");

    // Reset value when type changes
    $diskon.val("");

    // Simulate processing delay
    setTimeout(function () {
      // Hide loading state
      $jenisDiskon.prop("disabled", false);
      $("#diskon-spinner").addClass("d-none");

      // Update placeholder based on selection
      if (jenisDiskonVal === "nominal") {
        $diskon.prop("disabled", false);
        $diskon.attr("placeholder", "Contoh: 50000");
        $diskon.focus();
      } else if (jenisDiskonVal === "persentase") {
        $diskon.prop("disabled", false);
        $diskon.attr("placeholder", "Contoh: 10 - 100");
        $diskon.focus();
      } else {
        // If no valid selection (e.g. back to default), keep disabled
        $diskon.prop("disabled", true);
        $diskon.attr("placeholder", "Pilih jenis diskon terlebih dahulu");
      }
    }, 500);
  });

  $diskon.on("input", function () {
    const jenisDiskonVal = $jenisDiskon.val();
    const nilai = parseFloat($(this).val());

    if (jenisDiskonVal === "persentase" && nilai > 100) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Diskon tidak boleh lebih dari 100%",
      });
      $(this).val("");
    }
  });
});
