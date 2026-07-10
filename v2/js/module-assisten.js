async function prosesKirim() {
    const input = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');
    const msg = input ? input.value.trim() : "";
    
    if (!msg || !chatBody) return;

    // Tampilkan pesan user
    chatBody.innerHTML += `
        <div class="flex justify-end mb-2">
            <div class="bg-blue-600 text-white p-2 rounded-lg text-xs w-[80%]">${msg}</div>
        </div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const BASE_URL = "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec";
        
        // 1. Tentukan apakah ini Command atau FAQ
        // Jika dimulai dengan '/', gunakan action=getCommand
        const action = msg.startsWith('/') ? 'getCommand' : 'getFAQ';
        
        // 2. Panggil API dengan parameter yang benar (keyword, bukan pesan)
        const url = `${BASE_URL}?action=${action}&keyword=${encodeURIComponent(msg)}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        // 3. Ambil jawaban (GAS Anda menggunakan field 'answer')
        let reply = "Panda tidak mengerti pertanyaan tersebut.";
        if (data.status === "success" && data.answer) {
            reply = data.answer;
        } else if (data.status === "not_found") {
            reply = "Maaf, Panda belum punya jawaban untuk itu.";
        }

        chatBody.innerHTML += `
            <div class="flex justify-start mb-2">
                <div class="bg-white border p-2 rounded-lg text-xs text-gray-700 w-[80%]">🐼 ${reply}</div>
            </div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        
    } catch (e) {
        console.error(e);
        chatBody.innerHTML += `<div class="text-red-500 text-xs p-2">Error koneksi ke server.</div>`;
    }
}
