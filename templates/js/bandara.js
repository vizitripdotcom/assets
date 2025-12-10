$(document).ready(function () {
  // Store original kota_id for edit mode
  const originalKotaId = $("#kota_id").data("original");

  // Check for server-side validation errors on page load
  // This will highlight fields in red when there are validation errors from PHP
  function highlightServerErrors() {
    // Check if there's a SweetAlert error popup (indicates server validation error)
    // We'll wait a bit for SweetAlert to finish, then highlight the fields
    setTimeout(function () {
      // Map of error keywords to field IDs
      const errorFieldMap = {
        kode_iata: [
          "kode",
          "iata",
          "bandara",
          "unique",
          "sudah digunakan",
          "already",
        ],
        nama_bandara: ["nama bandara"],
        negara_id: ["negara"],
        kota_id: ["kota"],
      };

      // Get all error messages from the page (if any are displayed)
      let foundErrors = false;

      // Check if SweetAlert showed an error
      const swalContainer = document.querySelector(".swal2-container");
      if (swalContainer) {
        const swalContent = swalContainer.textContent.toLowerCase();

        // Check each field for errors in the message
        for (const [fieldId, keywords] of Object.entries(errorFieldMap)) {
          for (const keyword of keywords) {
            if (swalContent.includes(keyword.toLowerCase())) {
              $("#" + fieldId).addClass("is-invalid");
              foundErrors = true;
              break;
            }
          }
        }
      }
    }, 100);
  }

  // Run on page load to check for server errors
  highlightServerErrors();

  // Function to load cities by negara_id
  function loadKotaByNegara(negaraId, selectedKotaId = null) {
    if (!negaraId) {
      $("#kota_id")
        .html('<option value="">Pilih Negara terlebih dahulu</option>')
        .prop("disabled", true);
      return;
    }

    // Show loading state
    $("#kota_id")
      .html('<option value="">Loading...</option>')
      .prop("disabled", true);

    // Fetch cities from API
    $.ajax({
      url: baseUrl + "master/kota/get-by-negara/" + negaraId,
      type: "GET",
      dataType: "json",
      success: function (response) {
        let options = '<option value="">Pilih Kota</option>';

        if (response && response.length > 0) {
          response.forEach(function (kota) {
            const selected =
              selectedKotaId && kota.id == selectedKotaId ? "selected" : "";
            options += `<option value="${kota.id}" ${selected}>${kota.kota}</option>`;
          });
        } else {
          options = '<option value="">Tidak ada kota tersedia</option>';
        }

        $("#kota_id").html(options).prop("disabled", false);
      },
      error: function () {
        $("#kota_id")
          .html('<option value="">Error loading data</option>')
          .prop("disabled", false);
      },
    });
  }

  // On negara change
  $("#negara_id").on("change", function () {
    const negaraId = $(this).val();
    loadKotaByNegara(negaraId);
  });

  // On page load, if negara is already selected (edit mode)
  const initialNegaraId = $("#negara_id").val();
  if (initialNegaraId) {
    loadKotaByNegara(initialNegaraId, originalKotaId);
  }

  // Form validation and SweetAlert confirmation
  $("form").on("submit", function (e) {
    e.preventDefault();

    // Remove previous error styling
    $(".form-control, .form-select").removeClass("is-invalid");

    // Validate required fields
    let isValid = true;
    let errorMessages = [];

    // Check Kode Bandara
    const kodeIata = $("#kode_iata").val().trim();
    if (!kodeIata) {
      $("#kode_iata").addClass("is-invalid");
      errorMessages.push("Kode Bandara harus diisi");
      isValid = false;
    }

    // Check Nama Bandara
    const namaBandara = $("#nama_bandara").val().trim();
    if (!namaBandara) {
      $("#nama_bandara").addClass("is-invalid");
      errorMessages.push("Nama Bandara harus diisi");
      isValid = false;
    }

    // Check Negara
    const negaraId = $("#negara_id").val();
    if (!negaraId) {
      $("#negara_id").addClass("is-invalid");
      errorMessages.push("Negara harus dipilih");
      isValid = false;
    }

    // Check Kota
    const kotaId = $("#kota_id").val();
    if (!kotaId) {
      $("#kota_id").addClass("is-invalid");
      errorMessages.push("Kota harus dipilih");
      isValid = false;
    }

    // If validation fails, show error popup
    if (!isValid) {
      Swal.fire({
        title: "Validasi Gagal",
        html: errorMessages.join("<br>"),
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      return false;
    }

    // Show confirmation if all fields are valid
    Swal.fire({
      title: "Konfirmasi Simpan",
      text: "Apakah Anda yakin ingin menyimpan data bandara ini?",
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

  // Remove error styling when user starts typing
  $("#kode_iata, #nama_bandara").on("input", function () {
    $(this).removeClass("is-invalid");
  });

  $("#negara_id, #kota_id").on("change", function () {
    $(this).removeClass("is-invalid");
  });

  const $kode_iata = $("#kode_iata");
  $kode_iata.on("input", function () {
    const nilai = $(this).val();

    // Limit to 3 characters and convert to uppercase
    if (nilai.length > 3) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Kode IATA tidak boleh lebih dari 3 karakter",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      $(this).val(nilai.slice(0, 3).toUpperCase());
    } else {
      // Auto uppercase
      $(this).val(nilai.toUpperCase());
    }
  });
});
