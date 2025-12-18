$(document).ready(function() {
    // Initialize SCeditor for #konten
    var textarea = document.getElementById('konten');
    if (textarea) {
        sceditor.create(textarea, {
            format: 'bbcode',
            style: assetUrl + '/vendors/sceditor/minified/themes/content/default.min.css',
            height: 400,
            toolbarExclude: 'email,print,maximize',
            resizeWidth: false,
            emoticonsEnabled: false 
        });
    }

    // Image Upload Preview
    // Trigger file input on wrapper click
    $('.image-upload-wrapper').click(function() {
        $('#gambar').click();
    });

    // Handle file input change
    $('#gambar').change(function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#preview-image').attr('src', e.target.result).show();
                $('#image-preview-container').hide();
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // For Edit Page: if image exists, hide the container initially?
    // That is handled by PHP in the view (style="display:none"). 
    // But if we change image, we just overwrite the src and show it.
});
