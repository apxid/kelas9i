// js/module-assisten.js

const API = "https://script.google.com/macros/s/AKfycbzMe6SvN_qVVUG48vkCoMphQINZRV3BU_7nEz8cyO13Y5a5iC7xRQD9eH1lFRGwsi8ZNw/exec";

// Menggunakan MutationObserver untuk memastikan tombol terpasang saat elemen dimuat
const observer = new MutationObserver((mutations, obs) => {
    const btn = document.getElementById('btn-send');
    const input = document.getElementById('chat-input');
    
    if (btn && input) {
        btn.onclick = prosesKirim;
        input.onkeypress = (e) => { if (e.key === 'Enter') prosesKirim(); };
        obs.disconnect(); 
        console.log("Panda Chat: Listener berhasil dipasang.");
    }
});
observer.observe(document.body, { childList: true, subtree: true });

async function prosesKirim() {
    const input = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    if (!input || !chatBody) return;

    const msg = input.value.trim();
    if (!msg) return;

    // Tampilkan pesan user ke layar
    chatBody.innerHTML += `<div class="flex justify-end mb-2"><div class="bg-blue-600 text-white p-2 rounded-lg text-xs w-[80%]">${msg}</div></div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Registrasi Nama (tetap simpan di browser)
    if (!localStorage.getItem('panda_user')) {
        localStorage.setItem('panda_user', msg);
        chatBody.innerHTML += `<div class="bg-white p-3 rounded-lg shadow text-xs text-gray-700 w-[80%]">Halo ${msg}! Apa yang bisa saya bantu?</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        return;
    }

    const userName = localStorage.getItem('panda_user');

    // Kirim API
    try {
        // PENTING: Mengirim parameter 'question' agar sinkron dengan GAS Anda
        const url = `${API}?question=${encodeURIComponent(msg)}&userName=${encodeURIComponent(userName)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        // Log untuk memverifikasi isi data
        console.log("Respon API:", data);

        // Mengambil jawaban dari properti 'answer'
        const reply = data.answer || "Maaf, Panda belum mengerti.";
        
        chatBody.innerHTML += `<div class="bg-white p-3 rounded-lg shadow text-xs text-gray-700 w-[80%]">🐼 ${reply}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        
    } catch (e) {
        console.error("Error Detail:", e);
        chatBody.innerHTML += `<div class="text-red-500 text-xs p-2 text-center">Error koneksi ke server.</div>`;
    }
}
