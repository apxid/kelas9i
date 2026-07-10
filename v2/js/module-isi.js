// js/module-isi.js

function initIsi() {
    console.log("Modul Pengisian Biodata Aktif");
}

function submitFormBiodata() {
    const form = document.getElementById('main-bio-form');
    if (!form) return;

    const formDataObj = {};
    new FormData(form).forEach((value, key) => { formDataObj[key] = value; });
    
    showAlert('Memproses', 'Sedang menyimpan data...');

    fetch(`${BACKEND_URL}?action=submitBiodata&formData=${encodeURIComponent(JSON.stringify(formDataObj))}`)
        .then(r => r.json())
        .then(res => { 
            if (res.success) { 
                showAlert('Berhasil', res.message); 
                form.reset(); 
            } else {
                showAlert('Gagal', 'Terjadi kesalahan saat menyimpan.');
            }
        })
        .catch(e => showAlert('Error', 'Gagal terhubung ke server.'));
}
