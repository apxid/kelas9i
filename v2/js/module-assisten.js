console.log("Modul Asisten Siap");

// Event Listener Global
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'btn-send') {
        prosesKirim();
    }
});

document.addEventListener('keypress', function(e) {
    if (e.target && e.target.id === 'chat-input' && e.key === 'Enter') {
        prosesKirim();
    }
});

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

    // 2. Fetch ke API 
    // Kita hapus parameter 'action' untuk menghindari error "Action tidak dikenal"
    try {
        const BASE_URL = "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec";
        const url = `${BASE_URL}?pesan=${encodeURIComponent(msg)}`;
        
        console.log("Mengirim ke:", url);
        const res = await fetch(url);
        
        // Cek apakah response berupa JSON
        const textRes = await res.text();
        let data;
        try {
            data = JSON.parse(textRes);
        } catch (e) {
            console.error("Response bukan JSON:", textRes);
            throw new Error("Format respon salah dari server.");
        }
        
        // 3. Tampilkan balasan
        const replyText = data.reply || data.message || "Panda tidak merespon.";
        chatBody.innerHTML += `
            <div class="flex justify-start mb-2">
                <div class="bg-white border p-2 rounded-lg text-xs text-gray-700 w-[80%]">🐼 ${replyText}</div>
            </div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        
    } catch (e) {
        console.error("Error Detail:", e);
        chatBody.innerHTML += `
            <div class="text-red-500 text-xs p-2">Error: ${e.message}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}
