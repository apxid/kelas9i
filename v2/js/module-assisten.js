// js/module-assisten.js

const API = "https://script.google.com/macros/s/AKfycbzMe6SvN_qVVUG48vkCoMphQINZRV3BU_7nEz8cyO13Y5a5iC7xRQD9eH1lFRGwsi8ZNw/exec";

// Gunakan observer untuk mendeteksi kapan elemen muncul di halaman
const observer = new MutationObserver((mutations, obs) => {
    const btn = document.getElementById('btn-send');
    if (btn) {
        // Pasang event listener langsung ke tombol
        btn.onclick = prosesKirim;
        document.getElementById('chat-input').onkeypress = (e) => { 
            if (e.key === 'Enter') prosesKirim(); 
        };
        obs.disconnect(); // Hentikan pengawasan setelah terpasang
        console.log("Panda Chat Event Listener terpasang!");
    }
});
observer.observe(document.body, { childList: true, subtree: true });

async function prosesKirim() {
    const input = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    if (!input || !chatBody) return;

    const msg = input.value.trim();
    const userName = localStorage.getItem('panda_user') || 'Pengunjung';
    if (!msg) return;

    // Tampilkan pesan
    chatBody.innerHTML += `<div class="flex justify-end mb-2"><div class="bg-blue-600 text-white p-2 rounded-lg text-xs w-[80%]">${msg}</div></div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Registrasi Nama
    if (!localStorage.getItem('panda_user')) {
        localStorage.setItem('panda_user', msg);
        chatBody.innerHTML += `<div class="bg-white p-3 rounded-lg shadow text-xs text-gray-700 w-[80%]">Halo ${msg}! Ada yang bisa dibantu?</div>`;
        return;
    }

    // Kirim API
    try {
        const action = msg.startsWith('/') ? 'getCommand' : 'getFAQ';
        const url = `${API}?action=${action}&keyword=${encodeURIComponent(msg)}&userName=${encodeURIComponent(userName)}`;
        const res = await fetch(url);
        const data = await res.json();
        
        chatBody.innerHTML += `<div class="bg-white p-3 rounded-lg shadow text-xs text-gray-700 w-[80%]">🐼 ${data.answer || "Maaf, Panda belum mengerti."}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    } catch (e) {
        chatBody.innerHTML += `<div class="text-red-500 text-xs p-2 text-center">Error koneksi.</div>`;
    }
}
