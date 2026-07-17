// --- File: piket.js ---

function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { 
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data piket kosong.</p>'; 
            return; 
        }

        // Kita buat sistem pengelompokan yang sangat fleksibel
        const grouped = data.reduce((acc, curr) => {
            // Ambil kunci (kolom) secara dinamis
            const keys = Object.keys(curr);
            const hari = curr[keys[0]]; // Kolom A
            const nama = curr[keys[1]]; // Kolom B (Apapun nama kolomnya)
            
            if (!acc[hari]) acc[hari] = [];
            acc[hari].push(nama);
            return acc;
        }, {});

        let html = `<div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                      <div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-slate-700">🧹 Jadwal Piket Kelas</div>`;
        
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
