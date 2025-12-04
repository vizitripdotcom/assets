function previewImg() {
    const foto = document.querySelector('#foto');
    const imgPreview = document.querySelector('#img-preview');

    const fileFoto = foto.files[0];
    const fileReader = new FileReader();

    fileReader.readAsDataURL(fileFoto);

    fileReader.onload = function(e) {
        imgPreview.src = e.target.result;
    }
}
