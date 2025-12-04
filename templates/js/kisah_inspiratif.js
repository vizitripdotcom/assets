/**
 * Kisah Inspiratif JavaScript Functions
 * Handles image preview functionality
 */

$(document).ready(function() {
    // Image preview functionality
    $('#gambar').change(function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview img').attr('src', e.target.result);
                $('#image-preview').removeClass('d-none');
            }
            reader.readAsDataURL(file);
        } else {
            $('#image-preview').addClass('d-none');
        }
    });
});
