function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { 
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data kosong.</p>'; 
            return; 
        }

        // --- DEEBUGGING: Mari kita lihat apa nama kolom yang terbaca ---
        const firstItem = data[0];
        console.log("Struktur Data yang diterima:", firstItem); 
        // -----------------------------------------------------------

        const grouped = data.reduce((acc, curr) => {
            // Kita coba tebak nama kolomnya dari daftar kemungkinan yang sering terjadi
            const namaSiswa = curr['Daftar Nama Siswa'] || curr['Daftar_Nama_Siswa'] || curr['DaftarNamaSiswa'] || curr['Nama Siswa'] || Object.values(curr)[1];
            const hari = curr.Hari || Object.values(curr)[0];
            
            if (!acc[hari]) acc[hari] = [];
            acc[hari].push(namaSiswa);
            return acc;
        }, {});

        let html = `<div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                      <div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-slate-700">🧹 Jadwal Piket (Debug)</div>`;
        
        for (const hari in grouped) {
            html += `
                <div class="p-4 border-b border-gray-50 text-xs">
                    <div class="font-bold text-smpprimary uppercase mb-2">${hari}</div>
                    <div class="text-slate-600 leading-relaxed">• ${grouped[hari].join('<br>• ')}</div>
                </div>`;
        }
        
        container.innerHTML = html;
    });
}
