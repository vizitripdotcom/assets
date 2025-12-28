// Paket Umroh Multi-step Form JavaScript (jQuery Style)
$(document).ready(function () {
  "use strict";

  // Initialize Select2
  $(".select2").select2({
    theme: "bootstrap-5",
    width: "100%",
  });

  $("#maskapai_berangkat").select2({
    theme: "bootstrap-5",
    width: "100%",
    placeholder: "Pilih Maskapai",
    allowClear: true,
    templateResult: formatOption,
    templateSelection: formatSelection,
    escapeMarkup: function (markup) {
      return markup;
    },
  });

  function formatOption(option) {
    if (!option.id) {
      return option.text;
    }

    const title = $(option.element).data("title");
    const subtitle = $(option.element).data("subtitle");

    return `
          <div>
              ${title}<br />
              <small style="color:#666">${subtitle}</small>
          </div>
      `;
  }

  function formatSelection(option) {
    if (!option.id) {
      return option.text;
    }

    const title = $(option.element).data("title");
    return `${title}`;
  }

  // Initialize Flatpickr for multiple dates
  flatpickr("#tanggal_keberangkatan", {
    mode: "multiple",
    dateFormat: "Y-m-d",
    conjunction: ", ",
  });

  let currentTab = 0;
  const totalTabs = 7;
  let fasilitasTermasukCount = 0;
  let fasilitasBelumCount = 0;
  let itineraryCount = 0;
  let refundPolicyCount = 0;
  let jadwalCount = 0;

  // Tab navigation
  function showTab(n) {
    const $tabs = $(".tab-pane");
    const $tabButtons = $("#paketUmrohTabs .nav-link");

    if (n >= $tabs.length || n < 0) return false;

    // Hide all tabs and remove active class
    $tabs.removeClass("show active");
    $tabButtons.removeClass("active");

    // Show current tab
    $tabs.eq(n).addClass("show active");
    $tabButtons.eq(n).addClass("active");

    currentTab = n;

    // Update buttons
    $("#prev-tab").toggle(n !== 0);
    $("#next-tab").toggle(n !== totalTabs - 1);
  }

  // Fasilitas Termasuk
  function addFasilitasTermasuk() {
    const $container = $("#fasilitas-termasuk-container");
    if (!$container.length) return;

    // Calculate index from actual number of items
    const index = $("#fasilitas-termasuk-container .fasilitas-item").length;

    const html = `
            <div class="fasilitas-item mb-2" data-index="${index}">
                <div class="input-group">
                    <input type="hidden" name="fasilitas[${index}][tipe]" value="termasuk">
                    <input type="text" class="form-control" name="fasilitas[${index}][nama]" 
                           placeholder="Nama fasilitas..." required>
                    <button type="button" class="btn btn-danger btn-remove-fasilitas">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

    $container.append(html);
    fasilitasTermasukCount = $(
      "#fasilitas-termasuk-container .fasilitas-item"
    ).length;
  }

  // Fasilitas Belum Termasuk
  function addFasilitasBelum() {
    const $container = $("#fasilitas-belum-container");
    if (!$container.length) return;

    const baseIndex = 1000;
    // Calculate from actual items count
    const currentCount = $("#fasilitas-belum-container .fasilitas-item").length;
    const index = baseIndex + currentCount;

    const html = `
            <div class="fasilitas-item mb-2" data-index="${index}">
                <div class="input-group">
                    <input type="hidden" name="fasilitas[${index}][tipe]" value="belum_termasuk">
                    <input type="text" class="form-control" name="fasilitas[${index}][nama]" 
                           placeholder="Nama fasilitas..." required>
                    <button type="button" class="btn btn-danger btn-remove-fasilitas">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;

    $container.append(html);
    fasilitasBelumCount = $(
      "#fasilitas-belum-container .fasilitas-item"
    ).length;
  }

  // Add Itinerary
  function addItinerary() {
    const $container = $("#itinerary-container");
    if (!$container.length) return;

    // Calculate index from actual number of items in DOM
    const currentItemCount = $(".itinerary-item").length;
    const index = currentItemCount;
    const dayNumber = index + 1;

    const html = `
            <div class="card mb-3 itinerary-item" data-index="${index}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-2 flex-grow-1">
                        <span class="fw-bold">Hari ${dayNumber}</span>
                        <input type="text" 
                              class="form-control" 
                              name="itinerary[${index}][hari_header]" 
                              placeholder="Keterangan Kegiatan" 
                              required>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger btn-remove-itinerary ms-2">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
                <div class="card-body">
                    <input type="hidden" name="itinerary[${index}][hari]" value="${dayNumber}">
                    <textarea class="form-control" name="itinerary[${index}][deskripsi]" rows="3" placeholder="Deskripsi aktivitas hari ${dayNumber}..." required></textarea>
                </div>
            </div>
        `;

    $container.append(html);

    // Update counter to match
    itineraryCount = $(".itinerary-item").length;
  }

  // Renumber Itinerary
  function renumberItinerary() {
    $(".itinerary-item").each(function (index) {
      const dayNumber = index + 1;

      // Update data-index attribute
      $(this).attr("data-index", index);

      // Update display text
      $(this).find(".card-header span").text(`Hari ${dayNumber}`);

      // Update hidden input value
      $(this).find('input[type="hidden"]').val(dayNumber);

      // Update hidden input name
      $(this)
        .find('input[type="hidden"]')
        .attr("name", `itinerary[${index}][hari]`);

      // Update hari_header input name
      $(this)
        .find('input[name*="hari_header"]')
        .attr("name", `itinerary[${index}][hari_header]`);

      // Update textarea name and placeholder
      $(this)
        .find("textarea")
        .attr("name", `itinerary[${index}][deskripsi]`)
        .attr("placeholder", `Deskripsi aktivitas hari ${dayNumber}...`);
    });

    // Update counter to match actual count
    itineraryCount = $(".itinerary-item").length;
  }

  // Renumber Refund Policy
  function renumberRefundPolicy() {
    $(".refund-policy-item").each(function (index) {
      const policyNumber = index + 1;

      // Update data-index
      $(this).attr("data-index", index);

      // Get the actual title from input (if exists)
      const $titleInput = $(this).find('input[name*="judul_kebijakan"]');
      const titleValue = $titleInput.val();

      // Update accordion button text
      if (titleValue && titleValue.trim() !== "") {
        // Use actual title if available
        $(this).find(".accordion-button").text(titleValue);
      } else {
        // Use default numbering for new/empty items
        $(this).find(".accordion-button").text(`Kebijakan #${policyNumber}`);
      }

      // Update input names
      $titleInput.attr("name", `refund[${index}][judul_kebijakan]`);
      $(this)
        .find('textarea[name*="detail_kebijakan"]')
        .attr("name", `refund[${index}][detail_kebijakan]`);

      // Update accordion IDs
      $(this).find(".accordion-header").attr("id", `refund-heading-${index}`);
      $(this)
        .find(".accordion-button")
        .attr("data-bs-target", `#refund-collapse-${index}`);
      $(this)
        .find(".accordion-collapse")
        .attr("id", `refund-collapse-${index}`);
    });

    refundPolicyCount = $(".refund-policy-item").length;
  }

  // Add Refund Policy
  function addRefundPolicy() {
    const $container = $("#refundAccordion");
    if (!$container.length) return;

    // Calculate index from actual number of items
    const index = $(".refund-policy-item").length;

    const html = `
            <div class="accordion-item refund-policy-item" data-index="${index}">
                <h2 class="accordion-header" id="refund-heading-${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#refund-collapse-${index}">
                        Kebijakan #${index + 1}
                    </button>
                </h2>
                <div id="refund-collapse-${index}" class="accordion-collapse collapse" 
                     data-bs-parent="#refundAccordion">
                    <div class="accordion-body">
                        <div class="mb-3">
                            <label class="form-label">Judul Kebijakan</label>
                            <input type="text" class="form-control" name="refund[${index}][judul_kebijakan]" 
                                   placeholder="Contoh: Pembatalan H-30" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Detail Kebijakan</label>
                            <textarea class="form-control" name="refund[${index}][detail_kebijakan]" 
                                      rows="4" placeholder="Jelaskan detail kebijakan..." required></textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-info me-2 btn-copy-template">
                            <i class="fas fa-copy"></i> Copy dari Template
                        </button>
                        <button type="button" class="btn btn-sm btn-danger btn-remove-refund">
                            <i class="fas fa-trash"></i> Hapus Kebijakan
                        </button>
                    </div>
                </div>
            </div>
        `;

    $container.append(html);
    refundPolicyCount = $(".refund-policy-item").length;
  }

  // Add Jadwal (Legacy/Optional)
  function addJadwal() {
    const $container = $("#jadwal-container");
    if (!$container.length) return;

    // Calculate index from actual number of items
    const index = $(".jadwal-item").length;

    const html = `
            <div class="card mb-3 jadwal-item" data-index="${index}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Jadwal #${index + 1}</span>
                    <button type="button" class="btn btn-sm btn-danger btn-remove-jadwal">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Tanggal Keberangkatan</label>
                                <input type="date" class="form-control" name="jadwal[${index}][tanggal]" required>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="mb-3">
                                <label class="form-label">Harga Quad</label>
                                <input type="number" class="form-control" name="jadwal[${index}][quad]" 
                                       placeholder="25000000">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="mb-3">
                                <label class="form-label">Harga Triple</label>
                                <input type="number" class="form-control" name="jadwal[${index}][triple]" 
                                       placeholder="27000000">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="mb-3">
                                <label class="form-label">Harga Double</label>
                                <input type="number" class="form-control" name="jadwal[${index}][double]" 
                                       placeholder="30000000">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="mb-3">
                                <label class="form-label">Seat Tersedia</label>
                                <input type="number" class="form-control" name="jadwal[${index}][seat]" 
                                       placeholder="45">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    $container.append(html);
    jadwalCount = $(".jadwal-item").length;
  }

  // Image Preview for Muthawwif
  function previewMuthawwifPhoto() {
    const file = this.files[0];
    const $preview = $("#muthawwif-preview");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $preview.find("img").attr("src", e.target.result);
        $preview.removeClass("d-none");
      };
      reader.readAsDataURL(file);
    } else {
      $preview.addClass("d-none");
    }
  }

  // Banner Image Preview
  $("#banner_images").change(function () {
    const files = this.files;
    const thumbnailContainer = $("#thumbnail-container");
    const mainBannerImg = $("#main-banner-img");
    const mainBannerPlaceholder = $("#main-banner-placeholder");

    thumbnailContainer.empty();

    if (files && files.length > 0) {
      // Show first image as main
      const firstReader = new FileReader();
      firstReader.onload = function (e) {
        mainBannerImg.attr("src", e.target.result).show();
        mainBannerPlaceholder.hide();
      };
      firstReader.readAsDataURL(files[0]);

      // Create thumbnails
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const thumb = $(`
                        <div class="thumbnail-item" style="width: 60px; height: 40px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; cursor: pointer;">
                            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `);

          thumb.click(function () {
            mainBannerImg.attr("src", e.target.result);
          });

          thumbnailContainer.append(thumb);
        };
        reader.readAsDataURL(file);
      });
    } else {
      mainBannerImg.hide();
      mainBannerPlaceholder.show();
    }
  });

  // Perlengkapan Image Preview (New ID)
  $("#gambar_perlengkapan").change(function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#perlengkapan-preview-img").attr("src", e.target.result).show();
        $("#perlengkapan-placeholder").hide();
      };
      reader.readAsDataURL(file);
    } else {
      $("#perlengkapan-preview-img").hide();
      $("#perlengkapan-placeholder").show();
    }
  });

  // Dynamic List Perlengkapan (using .off().on() to prevent double-binding)
  $("#add-perlengkapan")
    .off("click")
    .on("click", function () {
      const itemHtml = `
            <div class="input-group mb-3 perlengkapan-item">
                <input type="text" class="form-control" name="list_perlengkapan[]" placeholder="Nama perlengkapan">
                <button class="btn btn-danger btn-remove-perlengkapan" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
      $("#list-perlengkapan-container").append(itemHtml);
    });

  $(document).on("click", ".btn-remove-perlengkapan", function () {
    $(this).closest(".perlengkapan-item").remove();
  });

  // Initialize
  showTab(0);

  // Validate current tab before proceeding
  function validateCurrentTab() {
    const $currentTabPane = $(".tab-pane").eq(currentTab);
    const $requiredFields = $currentTabPane.find(
      "input[required], select[required], textarea[required]"
    );
    let isValid = true;
    let errorMessages = [];

    $requiredFields.each(function () {
      const $field = $(this);
      const fieldName = $field.attr("name") || $field.attr("id") || "Field";
      const fieldLabel =
        $field
          .closest(".mb-3")
          .find("label")
          .first()
          .text()
          .replace("*", "")
          .trim() || fieldName;

      // Reset previous validation state
      $field.removeClass("is-invalid");

      // Check if field is empty
      if ($field.is("select")) {
        if (!$field.val() || $field.val() === "") {
          isValid = false;
          $field.addClass("is-invalid");
          errorMessages.push(fieldLabel);
        }
      } else if ($field.attr("type") === "file") {
        if (!$field[0].files || $field[0].files.length === 0) {
          isValid = false;
          $field.addClass("is-invalid");
          errorMessages.push(fieldLabel);
        }
      } else {
        if (!$field.val() || $field.val().trim() === "") {
          isValid = false;
          $field.addClass("is-invalid");
          errorMessages.push(fieldLabel);
        }
      }
    });

    if (!isValid) {
      // Show error message
      const errorText =
        errorMessages.length > 0
          ? `Mohon lengkapi field berikut: ${errorMessages
              .slice(0, 3)
              .join(", ")}${errorMessages.length > 3 ? ", ..." : ""}`
          : "Mohon lengkapi semua field yang wajib diisi";

      // Use Bootstrap alert or simple alert
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "warning",
          title: "Form Belum Lengkap",
          text: errorText,
          confirmButtonText: "OK",
        });
      } else {
        alert(errorText);
      }

      // Scroll to first invalid field
      const $firstInvalid = $currentTabPane.find(".is-invalid").first();
      if ($firstInvalid.length) {
        $firstInvalid[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setTimeout(() => $firstInvalid.focus(), 300);
      }
    }

    return isValid;
  }

  // Tab navigation buttons (using .off().on() to prevent double-binding)
  $("#next-tab")
    .off("click")
    .on("click", function () {
      // Validate before moving to next tab

      // if (!validateCurrentTab()) {
      //   return false;
      // }

      if (currentTab < totalTabs - 1) {
        showTab(currentTab + 1);
      }
    });

  $("#prev-tab")
    .off("click")
    .on("click", function () {
      if (currentTab > 0) {
        showTab(currentTab - 1);
      }
    });

  // Add buttons (using .off().on() to prevent double-binding)
  $("#add-fasilitas-termasuk").off("click").on("click", addFasilitasTermasuk);
  $("#add-fasilitas-belum").off("click").on("click", addFasilitasBelum);
  $("#add-itinerary").off("click").on("click", addItinerary);
  $("#add-refund-policy").off("click").on("click", addRefundPolicy);
  $("#add-jadwal").off("click").on("click", addJadwal);

  // Copy from Template Button (inside accordion items)
  $(document).on("click", ".btn-copy-template", function () {
    const $currentAccordionItem = $(this).closest(".refund-policy-item");
    // Store reference to current item for later use
    $("#templateModal").data("targetAccordionItem", $currentAccordionItem);

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("templateModal"));
    modal.show();
  });

  // Template Selection Handler
  $(document).on("click", ".template-item", function () {
    let templateData = $(this).data("template");

    console.log("=== TEMPLATE SELECTION DEBUG ===");
    console.log("1. Original templateData:", templateData);
    console.log("2. Type of templateData:", typeof templateData);

    const $targetItem = $("#templateModal").data("targetAccordionItem");

    // Parse templateData if it's a string
    if (typeof templateData === "string") {
      try {
        templateData = JSON.parse(templateData);
        console.log("3. Parsed templateData from string:", templateData);
      } catch (e) {
        console.error("Failed to parse template data:", e);
        alert("Template data tidak valid - gagal parse JSON");
        return;
      }
    }

    // Ensure data field is an array
    if (!templateData || !templateData.data) {
      console.error("4. Template data or data field is null/undefined");
      alert("Template data tidak valid - data kosong");
      return;
    }

    console.log("5. templateData.data:", templateData.data);
    console.log("6. Type of templateData.data:", typeof templateData.data);

    // If data is a string, parse it
    if (typeof templateData.data === "string") {
      try {
        templateData.data = JSON.parse(templateData.data);
        console.log(
          "7. Parsed templateData.data from string:",
          templateData.data
        );
      } catch (e) {
        console.error("Failed to parse template data.data:", e);
        alert("Template data tidak valid - gagal parse data field");
        return;
      }
    }

    console.log("8. Final templateData.data:", templateData.data);
    console.log("9. Is array?", Array.isArray(templateData.data));

    // Handle both array and object formats
    let dataArray;
    if (Array.isArray(templateData.data)) {
      dataArray = templateData.data;
      console.log("10. Using array directly");
    } else if (
      typeof templateData.data === "object" &&
      templateData.data !== null
    ) {
      console.log("10. Converting object to array");
      const values = Object.values(templateData.data);
      // Flatten nested objects
      dataArray = [];
      values.forEach((item) => {
        if (typeof item === "object" && item !== null) {
          if (item.title || item.description) {
            dataArray.push(item);
          } else {
            Object.values(item).forEach((nested) => {
              if (
                typeof nested === "object" &&
                (nested.title || nested.description)
              ) {
                dataArray.push(nested);
              }
            });
          }
        }
      });
      console.log("11. Converted array:", dataArray);
    } else {
      console.error("10. Invalid data type:", typeof templateData.data);
      alert("Template data format tidak sesuai");
      return;
    }

    if (!dataArray || dataArray.length === 0) {
      console.error("12. No valid data found");
      alert("Template tidak memiliki data yang valid");
      return;
    }

    console.log("13. Final array:", dataArray);
    console.log("=== END DEBUG ===");

    // If we have a target accordion item, copy ALL items into ONE field
    if ($targetItem && $targetItem.length) {
      // Use template header as the title
      $targetItem
        .find("input[name*='judul_kebijakan']")
        .val(templateData.header || "");

      // Combine ALL descriptions into a numbered list
      const combinedDescription = dataArray
        .map((item) => {
          const number = item.title || "";
          const desc = item.description || "";
          return `${number}. ${desc}`;
        })
        .join("\n\n");

      $targetItem
        .find("textarea[name*='detail_kebijakan']")
        .val(combinedDescription);

      // Show success message
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `${dataArray.length} item berhasil di-copy dari template "${templateData.header}"`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } else {
      // No target item, replace all (fallback behavior)
      $("#refundAccordion").empty();
      refundPolicyCount = 0;

      // Create refund policy items from template data
      dataArray.forEach((item, index) => {
        const policyIndex = refundPolicyCount++;

        const html = `
            <div class="accordion-item refund-policy-item" data-index="${policyIndex}">
                <h2 class="accordion-header" id="refund-heading-${policyIndex}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#refund-collapse-${policyIndex}">
                        Kebijakan #${policyIndex + 1}
                    </button>
                </h2>
                <div id="refund-collapse-${policyIndex}" class="accordion-collapse collapse" 
                     data-bs-parent="#refundAccordion">
                    <div class="accordion-body">
                        <div class="mb-3">
                            <label class="form-label">Judul Kebijakan</label>
                            <input type="text" class="form-control" name="refund[${policyIndex}][judul_kebijakan]" 
                                   value="${
                                     item.title || ""
                                   }" placeholder="Contoh: Pembatalan H-30" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Detail Kebijakan</label>
                            <textarea class="form-control" name="refund[${policyIndex}][detail_kebijakan]" 
                                      rows="4" placeholder="Jelaskan detail kebijakan..." required>${
                                        item.description || ""
                                      }</textarea>
                        </div>
                        <button type="button" class="btn btn-sm btn-outline-info me-2 btn-copy-template">
                            <i class="fas fa-copy"></i> Copy dari Template
                        </button>
                        <button type="button" class="btn btn-sm btn-danger btn-remove-refund">
                            <i class="fas fa-trash"></i> Hapus Kebijakan
                        </button>
                    </div>
                </div>
            </div>
        `;

        $("#refundAccordion").append(html);
      });

      // Show success message
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `${templateData.data.length} kebijakan berhasil di-copy dari template "${templateData.header}"`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }

    // Close modal properly and clean up
    const modalElement = document.getElementById("templateModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();

      // Wait for modal to finish hiding, then cleanup
      $(modalElement).one("hidden.bs.modal", function () {
        // Remove any leftover backdrops
        $(".modal-backdrop").remove();
        // Remove modal-open class from body
        $("body").removeClass("modal-open");
        // Reset body styles
        $("body").css("overflow", "");
        $("body").css("padding-right", "");

        // Clear the stored reference
        $("#templateModal").removeData("targetAccordionItem");
      });
    } else {
      // Fallback cleanup if modal instance not found
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
      $("body").css("overflow", "");
      $("body").css("padding-right", "");
      $("#templateModal").removeData("targetAccordionItem");
    }
  });

  // Delegated remove events
  $(document).on("click", ".btn-remove-fasilitas", function () {
    $(this).closest(".fasilitas-item").remove();
  });

  $(document).on("click", ".btn-remove-itinerary", function () {
    $(this).closest(".itinerary-item").remove();
    renumberItinerary();
  });

  $(document).on("click", ".btn-remove-refund", function () {
    $(this).closest(".refund-policy-item").remove();
    renumberRefundPolicy();
  });

  $(document).on("click", ".btn-remove-jadwal", function () {
    $(this).closest(".jadwal-item").remove();
  });

  // Update accordion button text when refund title input changes
  $(document).on("input", 'input[name*="judul_kebijakan"]', function () {
    const $accordionItem = $(this).closest(".refund-policy-item");
    const titleValue = $(this).val();

    if (titleValue && titleValue.trim() !== "") {
      $accordionItem.find(".accordion-button").text(titleValue);
    } else {
      const index = $accordionItem.index();
      $accordionItem.find(".accordion-button").text(`Kebijakan #${index + 1}`);
    }
  });

  // Image previews
  $("#muthawwif_foto").on("change", previewMuthawwifPhoto);

  // Note: Fasilitas starts empty - user clicks button to add

  // Handle Status Button Clicks
  $("#btn-save-draft").on("click", function () {
    $("#status").val("Draft");
  });

  $("#submit-btn").on("click", function () {
    $("#status").val("Published");
  });

  // Handle Brosur Upload Button
  $("#btn-upload-brosur").on("click", function () {
    $("#upload_brosur").click();
  });

  // Handle Brosur File Change (Show Filename)
  $("#upload_brosur").on("change", function () {
    if (this.files && this.files[0]) {
      $("#brosur-filename").text(this.files[0].name).removeClass("d-none");
    } else {
      $("#brosur-filename").addClass("d-none");
    }
  });
});

$(document).ready(function () {
  const priceInputs = [
    { input: "hargaSingleRupiah", hidden: "harga_single" },
    { input: "hargaDoubleRupiah", hidden: "harga_double" },
    { input: "hargaTripleRupiah", hidden: "harga_triple" },
    { input: "hargaQuadRupiah", hidden: "harga_quad" },
  ];

  priceInputs.forEach((item) => {
    const inputEl = document.getElementById(item.input);
    const hiddenEl = document.getElementById(item.hidden);

    $("#" + item.input).val("Rp. " + hiddenEl.value);

    if (inputEl && hiddenEl) {
      inputEl.addEventListener("keyup", function (e) {
        // Format To Rupiah
        this.value = formatRupiah(this.value, "Rp. ");
        // Unformat Rupiah to hidden input
        hiddenEl.value = unFormatRupiah(this.value);
        inputEl.value = formatRupiah(this.value, "Rp. ");
      });
    }
  });
});

/* Fungsi formatRupiah
 * source: https://malasngoding.github.io/format-rupiah-javascript/
 */
function formatRupiah(angka, prefix) {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
}

/*
 * source: https://chatgpt.com/s/t_6935dddff0888191a42631eaa5d4eea2
 */
function unFormatRupiah(rupiah) {
  return rupiah.replace(/Rp\.?\s?/g, "").replace(/\./g, "");
}

// Sticky Header Functionality
$(document).ready(function () {
  const stickyHeader = $("#sticky-header");

  if (stickyHeader.length) {
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 100) {
        stickyHeader.addClass("scrolled");
      } else {
        stickyHeader.removeClass("scrolled");
      }
    });
  }
});

// AJAX Handler for Maskapai Selection
$(document).ready(function () {
  // Handle Maskapai Berangkat (Departure) Selection
  $("#maskapai_berangkat").on("change", function () {
    const maskapaiId = $(this).val();

    if (maskapaiId) {
      fetchMaskapaiDetails(maskapaiId, "berangkat");
    }
  });

  // Handle Maskapai Pulang (Return) Selection
  $("#maskapai_pulang").on("change", function () {
    const maskapaiId = $(this).val();

    if (maskapaiId) {
      fetchMaskapaiDetails(maskapaiId, "pulang");
    }
  });

  // Function to fetch maskapai details via AJAX
  function fetchMaskapaiDetails(maskapaiId, type) {
    $.ajax({
      url: baseUrl + "master/maskapai/get-maskapai-details/" + maskapaiId, // Adjust this endpoint as needed
      method: "GET",
      dataType: "json",
      beforeSend: function () {
        // Optional: Show loading indicator
        console.log("Fetching maskapai details for ID:", maskapaiId);
      },
      success: function (response) {
        console.log("Maskapai details response:", response);

        // Handle the response data here
        // The API returns data directly, not wrapped in {success: true, data: ...}
        if (response && response.id) {
          const maskapai = response;

          console.log("Maskapai details:", maskapai);

          // Check if airline has transit and show/hide the transit field
          if (maskapai.is_transit === "transit") {
            $("#transit_" + type).show();
          } else {
            $("#transit_" + type).hide();
          }

          // Optional: Show alert with maskapai info (you can remove this if not needed)
          // if (typeof Swal !== "undefined") {
          //   Swal.fire({
          //     icon: "info",
          //     title: "Detail Maskapai",
          //     html: `
          //       <div class="text-start">
          //         <p><strong>Nama:</strong> ${maskapai.nama_maskapai || "-"}</p>
          //         <p><strong>Transit:</strong> ${maskapai.is_transit || "-"}</p>
          //       </div>
          //     `,
          //     confirmButtonText: "OK",
          //   });
          // }
        } else {
          console.warn("No maskapai data found in response");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching maskapai details:", error);

        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Gagal mengambil detail maskapai. Silakan coba lagi.",
            confirmButtonText: "OK",
          });
        } else {
          alert("Gagal mengambil detail maskapai");
        }
      },
    });
  }

  // Initialize transit fields on page load (for edit form)
  function initializeTransitFields() {
    // Check maskapai berangkat
    const maskapaiBerangkatId = $("#maskapai_berangkat").val();
    if (maskapaiBerangkatId) {
      fetchMaskapaiDetails(maskapaiBerangkatId, "berangkat");
    }

    // Check maskapai pulang
    const maskapaiPulangId = $("#maskapai_pulang").val();
    if (maskapaiPulangId) {
      fetchMaskapaiDetails(maskapaiPulangId, "pulang");
    }
  }

  // Call initialization when document is ready
  initializeTransitFields();
});
