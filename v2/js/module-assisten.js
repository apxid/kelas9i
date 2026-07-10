console.log("Modul Asisten Siap");

// Gunakan 'document' sebagai pendengar agar selalu menangkap klik/enter
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
    const msg = input.value.trim();
    
    if (!msg || !chatBody) return;

    // 1. Tampilkan pesan user
    chatBody.innerHTML += `<div class="bg-blue-600 text-white p-2 rounded text-xs ml-auto w-4/5">${msg}</div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Fetch ke API
    try {
        const url = "https://script.google.com/macros/s/AKfycbwx1xLp3t0fgG1idoqsz9vCaEd0A3xo8N9pzcLLY8bzzjn9npvoKijXBFtOg4iekBFn1A/exec?action=chat&pesan=" + encodeURIComponent(msg);
        const res = await fetch(url);
        const data = await res.json();
        
        // 3. Tampilkan balasan
        chatBody.innerHTML += `<div class="bg-white border p-2 rounded text-xs text-gray-700 w-4/5">Panda: ${data.reply || '...'}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    } catch (e) {
        chatBody.innerHTML += `<div class="text-red-500 text-xs p-2">Error koneksi.</div>`;
    }
}
