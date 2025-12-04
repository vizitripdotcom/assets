// Paket Umroh Multi-step Form JavaScript (jQuery Style)
$(document).ready(function() {
    'use strict';

    // Initialize Select2
    $('.select2').select2({
        theme: 'bootstrap-5',
        width: '100%'
    });

    // Initialize Flatpickr for multiple dates
    flatpickr("#tanggal_keberangkatan", {
        mode: "multiple",
        dateFormat: "Y-m-d",
        conjunction: ", "
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
        const $tabs = $('.tab-pane');
        const $tabButtons = $('#paketUmrohTabs .nav-link');
        
        if (n >= $tabs.length || n < 0) return false;

        // Hide all tabs and remove active class
        $tabs.removeClass('show active');
        $tabButtons.removeClass('active');

        // Show current tab
        $tabs.eq(n).addClass('show active');
        $tabButtons.eq(n).addClass('active');

        currentTab = n;

        // Update buttons
        $('#prev-tab').toggle(n !== 0);
        
        if (n === (totalTabs - 1)) {
            $('#next-tab').addClass('d-none');
            $('#submit-btn').removeClass('d-none');
        } else {
            $('#next-tab').removeClass('d-none');
            $('#submit-btn').addClass('d-none');
        }
    }

    // Fasilitas Termasuk
    function addFasilitasTermasuk() {
        const $container = $('#fasilitas-termasuk-container');
        if (!$container.length) return;
        
        const index = fasilitasTermasukCount++;
        
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
    }

    // Fasilitas Belum Termasuk
    function addFasilitasBelum() {
        const $container = $('#fasilitas-belum-container');
        if (!$container.length) return;
        
        const baseIndex = 1000;
        const index = baseIndex + fasilitasBelumCount++;
        
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
    }

    // Add Itinerary
    function addItinerary() {
        const $container = $('#itinerary-container');
        if (!$container.length) return;
        
        const index = itineraryCount++;
        const dayNumber = index + 1;
        
        const html = `
            <div class="card mb-3 itinerary-item" data-index="${index}">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Hari ${dayNumber}</span>
                    <button type="button" class="btn btn-sm btn-danger btn-remove-itinerary">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
                <div class="card-body">
                    <input type="hidden" name="itinerary[${index}][hari]" value="${dayNumber}">
                    <textarea class="form-control" name="itinerary[${index}][deskripsi]" 
                              rows="3" placeholder="Deskripsi aktivitas hari ${dayNumber}..." required></textarea>
                </div>
            </div>
        `;
        
        $container.append(html);
    }

    // Renumber Itinerary
    function renumberItinerary() {
        $('.itinerary-item').each(function(index) {
            const dayNumber = index + 1;
            $(this).find('.card-header span').text(`Hari ${dayNumber}`);
            $(this).find('input[type="hidden"]').val(dayNumber);
            $(this).find('textarea').attr('placeholder', `Deskripsi aktivitas hari ${dayNumber}...`);
        });
        itineraryCount = $('.itinerary-item').length;
    }

    // Add Refund Policy
    function addRefundPolicy() {
        const $container = $('#refundAccordion');
        if (!$container.length) return;
        
        const index = refundPolicyCount++;
        
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
                        <button type="button" class="btn btn-sm btn-danger btn-remove-refund">
                            <i class="fas fa-trash"></i> Hapus Kebijakan
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $container.append(html);
    }

    // Add Jadwal (Legacy/Optional)
    function addJadwal() {
        const $container = $('#jadwal-container');
        if (!$container.length) return;
        
        const index = jadwalCount++;
        
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
    }

    // Image Preview for Muthawwif
    function previewMuthawwifPhoto() {
        const file = this.files[0];
        const $preview = $('#muthawwif-preview');
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $preview.find('img').attr('src', e.target.result);
                $preview.removeClass('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            $preview.addClass('d-none');
        }
    }

    // Banner Image Preview
    $('#banner_images').change(function() {
        const files = this.files;
        const thumbnailContainer = $('#thumbnail-container');
        const mainBannerImg = $('#main-banner-img');
        const mainBannerPlaceholder = $('#main-banner-placeholder');

        thumbnailContainer.empty();

        if (files && files.length > 0) {
            // Show first image as main
            const firstReader = new FileReader();
            firstReader.onload = function(e) {
                mainBannerImg.attr('src', e.target.result).show();
                mainBannerPlaceholder.hide();
            }
            firstReader.readAsDataURL(files[0]);

            // Create thumbnails
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const thumb = $(`
                        <div class="thumbnail-item" style="width: 60px; height: 40px; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; cursor: pointer;">
                            <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `);
                    
                    thumb.click(function() {
                        mainBannerImg.attr('src', e.target.result);
                    });

                    thumbnailContainer.append(thumb);
                }
                reader.readAsDataURL(file);
            });
        } else {
            mainBannerImg.hide();
            mainBannerPlaceholder.show();
        }
    });

    // Perlengkapan Image Preview (New ID)
    $('#gambar_perlengkapan').change(function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#perlengkapan-preview-img').attr('src', e.target.result).show();
                $('#perlengkapan-placeholder').hide();
            }
            reader.readAsDataURL(file);
        } else {
            $('#perlengkapan-preview-img').hide();
            $('#perlengkapan-placeholder').show();
        }
    });

    // Dynamic List Perlengkapan (using .off().on() to prevent double-binding)
    $('#add-perlengkapan').off('click').on('click', function() {
        const itemHtml = `
            <div class="input-group mb-3 perlengkapan-item">
                <input type="text" class="form-control" name="list_perlengkapan[]" placeholder="Nama perlengkapan">
                <button class="btn btn-danger btn-remove-perlengkapan" type="button">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        $('#list-perlengkapan-container').append(itemHtml);
    });

    $(document).on('click', '.btn-remove-perlengkapan', function() {
        $(this).closest('.perlengkapan-item').remove();
    });

    // Initialize
    showTab(0);

    // Validate current tab before proceeding
    function validateCurrentTab() {
        const $currentTabPane = $('.tab-pane').eq(currentTab);
        const $requiredFields = $currentTabPane.find('input[required], select[required], textarea[required]');
        let isValid = true;
        let errorMessages = [];

        $requiredFields.each(function() {
            const $field = $(this);
            const fieldName = $field.attr('name') || $field.attr('id') || 'Field';
            const fieldLabel = $field.closest('.mb-3').find('label').first().text().replace('*', '').trim() || fieldName;

            // Reset previous validation state
            $field.removeClass('is-invalid');

            // Check if field is empty
            if ($field.is('select')) {
                if (!$field.val() || $field.val() === '') {
                    isValid = false;
                    $field.addClass('is-invalid');
                    errorMessages.push(fieldLabel);
                }
            } else if ($field.attr('type') === 'file') {
                if (!$field[0].files || $field[0].files.length === 0) {
                    isValid = false;
                    $field.addClass('is-invalid');
                    errorMessages.push(fieldLabel);
                }
            } else {
                if (!$field.val() || $field.val().trim() === '') {
                    isValid = false;
                    $field.addClass('is-invalid');
                    errorMessages.push(fieldLabel);
                }
            }
        });

        if (!isValid) {
            // Show error message
            const errorText = errorMessages.length > 0 
                ? `Mohon lengkapi field berikut: ${errorMessages.slice(0, 3).join(', ')}${errorMessages.length > 3 ? ', ...' : ''}`
                : 'Mohon lengkapi semua field yang wajib diisi';
            
            // Use Bootstrap alert or simple alert
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Form Belum Lengkap',
                    text: errorText,
                    confirmButtonText: 'OK'
                });
            } else {
                alert(errorText);
            }

            // Scroll to first invalid field
            const $firstInvalid = $currentTabPane.find('.is-invalid').first();
            if ($firstInvalid.length) {
                $firstInvalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => $firstInvalid.focus(), 300);
            }
        }

        return isValid;
    }

    // Tab navigation buttons (using .off().on() to prevent double-binding)
    $('#next-tab').off('click').on('click', function() {
        // Validate before moving to next tab
        if (!validateCurrentTab()) {
            return false;
        }

        if (currentTab < totalTabs - 1) {
            showTab(currentTab + 1);
        }
    });

    $('#prev-tab').off('click').on('click', function() {
        if (currentTab > 0) {
            showTab(currentTab - 1);
        }
    });

    // Add buttons (using .off().on() to prevent double-binding)
    $('#add-fasilitas-termasuk').off('click').on('click', addFasilitasTermasuk);
    $('#add-fasilitas-belum').off('click').on('click', addFasilitasBelum);
    $('#add-itinerary').off('click').on('click', addItinerary);
    $('#add-refund-policy').off('click').on('click', addRefundPolicy);
    $('#add-jadwal').off('click').on('click', addJadwal);

    // Delegated remove events
    $(document).on('click', '.btn-remove-fasilitas', function() {
        $(this).closest('.fasilitas-item').remove();
    });

    $(document).on('click', '.btn-remove-itinerary', function() {
        $(this).closest('.itinerary-item').remove();
        renumberItinerary();
    });

    $(document).on('click', '.btn-remove-refund', function() {
        $(this).closest('.refund-policy-item').remove();
    });

    $(document).on('click', '.btn-remove-jadwal', function() {
        $(this).closest('.jadwal-item').remove();
    });

    // Image previews
    $('#muthawwif_foto').on('change', previewMuthawwifPhoto);
    
    // Note: Fasilitas starts empty - user clicks button to add
});
