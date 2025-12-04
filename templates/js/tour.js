$(document).ready(function() {
    // Initialize Select2
    if ($('.select2').length > 0) {
        $('.select2').select2({
            theme: 'bootstrap-5'
        });
    }

    // Image preview logic
    $('#cover_image').change(function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview img').attr('src', e.target.result);
                $('#image-preview').removeClass('d-none');
            }
            reader.readAsDataURL(file);
        }
    });
});
