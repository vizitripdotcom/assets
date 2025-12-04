$(document).ready(function () {
    // Store original kota_id for edit mode
    const originalKotaId = $('#kota_id').data('original');
    
    // Function to toggle fields based on is_transit value
    function toggleTransitFields() {
        const isTransit = $('input[name="is_transit"]:checked').val();
        
        if (isTransit === 'direct') {
            // Disable fields for direct flights
            $('#negara_id').prop('disabled', true).prop('required', false);
            $('#kota_id').prop('disabled', true).prop('required', false);
            $('#durasi_transit').prop('disabled', true).prop('required', false);
            
            // Clear values
            $('#negara_id').val('');
            $('#kota_id').html('<option value="">Pilih Negara terlebih dahulu</option>');
            $('#durasi_transit').val('');
        } else {
            // Enable fields for transit flights
            $('#negara_id').prop('disabled', false).prop('required', true);
            $('#kota_id').prop('required', true);
            $('#durasi_transit').prop('disabled', false).prop('required', false);
            
            // If negara is selected, load kota
            const negaraId = $('#negara_id').val();
            if (negaraId) {
                loadKotaByNegara(negaraId);
            }
        }
    }
    
    // Function to load cities by negara_id
    function loadKotaByNegara(negaraId, selectedKotaId = null) {
        if (!negaraId) {
            $('#kota_id').html('<option value="">Pilih Negara terlebih dahulu</option>').prop('disabled', true);
            return;
        }
        
        // Show loading state
        $('#kota_id').html('<option value="">Loading...</option>').prop('disabled', true);
        
        // Fetch cities from API
        $.ajax({
            url: baseUrl + 'master/kota/get-by-negara/' + negaraId,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                let options = '<option value="">Pilih Kota</option>';
                
                if (response && response.length > 0) {
                    response.forEach(function(kota) {
                        const selected = (selectedKotaId && kota.id == selectedKotaId) ? 'selected' : '';
                        options += `<option value="${kota.id}" ${selected}>${kota.kota}</option>`;
                    });
                } else {
                    options = '<option value="">Tidak ada kota tersedia</option>';
                }
                
                $('#kota_id').html(options).prop('disabled', false);
            },
            error: function() {
                $('#kota_id').html('<option value="">Error loading data</option>').prop('disabled', false);
            }
        });
    }
    
    // On negara change
    $('#negara_id').on('change', function() {
        const negaraId = $(this).val();
        loadKotaByNegara(negaraId);
    });
    
    // On page load, if negara is already selected (edit mode)
    const initialNegaraId = $('#negara_id').val();
    if (initialNegaraId) {
        loadKotaByNegara(initialNegaraId, originalKotaId);
    }
    
    // Listen to is_transit radio button changes
    $('input[name="is_transit"]').on('change', function() {
        toggleTransitFields();
    });
    
    // Initialize field states on page load
    toggleTransitFields();
    
    // Form submission confirmation
    $("#formMaskapai button[type='submit']").on("click", function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Simpan Perubahan?',
            text: "Anda akan menyimpan perubahan pada data Maskapai ini.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Simpan',
            cancelButtonText: 'Batal',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.isConfirmed) {
                $("#formMaskapai").submit();
            }
        });
    });
});
