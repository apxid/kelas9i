// js/module-assisten.js

function initAssisten() {
    // Inisialisasi tampilan chat jika diperlukan
    console.log("Modul Asisten Siap");
}

function kirimPesan() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    // Logika kirim pesan ke backend/AI
    showAlert('Info', 'Fitur Asisten sedang diproses...');
    input.value = "";
}
