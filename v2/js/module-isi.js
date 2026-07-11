// js/module-isi.js

/**
 * Inisialisasi Modul Pengisian Biodata
 * Panggil fungsi ini saat menu Form dipilih di aplikasi utama Anda
 */
function initIsi() {
    console.log("Modul Pengisian Biodata Aktif");
    // Tambahkan logika tambahan di sini jika perlu memuat data default ke dalam form
}

/**
 * Menangani pengiriman data formulir
 * Mengubah data formulir menjadi format JSON yang aman untuk Google Apps Script
 */
async function submitFormBiodata() {
    const form = document.getElementById('main-bio-form');
    if (!form) {
        console.error("Elemen form #main-bio-form tidak ditemukan!");
        return;
    }

    // Mengambil data dan memastikan key tidak mengandung spasi agar aman di backend
    const formDataObj = {};
    new FormData(form).forEach((value, key) => {
        // Mengganti spasi dengan underscore untuk menghindari error di sisi server
        const cleanKey = key.replace(/\s+/g, '_');
        formDataObj[cleanKey] = value;
    });

    // Validasi sederhana (opsional)
    if (!formDataObj.NISN) {
        showAlert('Peringatan', 'NISN wajib diisi!');
        return;
    }

    showAlert('Memproses', 'Sedang menyimpan data...');

    try {
        const response = await fetch(`${BACKEND_URL}?action=submitBiodata&formData=${encodeURIComponent(JSON.stringify(formDataObj))}`);
        const res = await response.json();

        if (res.success) {
            showAlert('Berhasil', res.message || 'Data berhasil disimpan.');
            form.reset();
        } else {
            showAlert('Gagal', res.message || 'Terjadi kesalahan saat menyimpan.');
        }
    } catch (e) {
        console.error("Error submit form:", e);
        showAlert('Error', 'Gagal terhubung ke server. Periksa koneksi Anda.');
    }
}
