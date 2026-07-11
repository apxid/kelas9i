async function prosesKirim() {
    const input = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const msg = input ? input.value.trim() : "";
    
    if (!msg || !chatBody) return;

    // 1. Tampilkan pesan user ke layar
    chatBody.innerHTML += `
        <div class="flex justify-end mb-2">
            <div class="bg-blue-600 text-white p-2 rounded-lg text-xs w-[80%]">${msg}</div>
        </div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Logika Registrasi Nama (Jika belum ada di localStorage)
    if (!localStorage.getItem('panda_user')) {
        localStorage.setItem('panda_user', msg);
        chatBody.innerHTML += `
            <div class="flex justify-start mb-2">
                <div class="bg-white border p-2 rounded-lg text-xs text-gray-700 w-[80%]">🐼 Halo ${msg}! Ada yang bisa saya bantu?</div>
            </div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        return;
    }

    const userName = localStorage.getItem('panda_user');

    // 3. Panggilan API
    try {
        const BASE_URL = "https://script.google.com/macros/s/AKfycbzMe6SvN_qVVUG48vkCoMphQINZRV3BU_7nEz8cyO13Y5a5iC7xRQD9eH1lFRGwsi8ZNw/exec";
        
        const action = msg.startsWith('/') ? 'getCommand' : 'getFAQ';
        const url = `${BASE_URL}?action=${action}&keyword=${encodeURIComponent(msg)}&userName=${encodeURIComponent(userName)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        let reply = "Panda tidak mengerti pertanyaan tersebut.";
        if (data.status === "success" && data.answer) {
            reply = data.answer;
        } else if (data.status === "not_found") {
            reply = "Maaf, Panda belum punya jawaban untuk itu.";
        }

        // Tampilkan balasan AI
        chatBody.innerHTML += `
            <div class="flex justify-start mb-2">
                <div class="bg-white border p-2 rounded-lg text-xs text-gray-700 w-[80%]">🐼 ${reply}</div>
            </div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        
    } catch (e) {
        console.error("Error Detail:", e);
        chatBody.innerHTML += `
            <div class="text-red-500 text-xs p-2">Error: Koneksi ke server gagal.</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}
