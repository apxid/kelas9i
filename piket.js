// --- File: piket.js (Versi Paksa Ambil Data) ---

function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { 
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data kosong.</p>'; 
            return; 
        }

        // Tampilkan data mentah di console untuk memastikan data terbaca
        console.log("Data diterima:", data);

        const grouped = data.reduce((acc, curr) => {
            // Ambil semua nilai dari baris ini menjadi array
            const values = Object.values(curr);
            const hari = values[0]; // Kolom A
            const nama = values[1]; // Kolom B
            
            if (hari) {
                if (!acc[hari]) acc[hari] = [];
                // Hanya masukkan jika nama tidak kosong atau bukan strip
                acc[hari].push(nama || "-"); 
            }
            return acc;
        }, {});

        let html = `<div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                      <div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-slate-700">🧹 Jadwal Piket</div>`;
        
        for (const hari in grouped) {
            html += `
                <div class="p-4 border-b border-gray-50 text-xs">
                    <div class="font-bold text-smpprimary uppercase mb-2">${hari}</div>
                    <div class="text-slate-600 leading-relaxed">• ${grouped[hari].join('<br>• ')}</div>
                </div>`;
        }
        container.innerHTML = html + '</div>';
    });
}
