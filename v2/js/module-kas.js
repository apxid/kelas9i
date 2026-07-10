// js/module-kas.js

function initKas() {
    loadDataKas();
}

function loadDataKas() {
    const container = document.getElementById('kas-container');
    if (!container) return;
    
    container.innerHTML = '<p class="text-xs text-gray-400">Memuat data keuangan...</p>';

    callBackend('getData', { sheetName: 'KAS' }).then(data => {
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data kas belum tersedia.</p>';
            return;
        }

        // Render tabel atau list kas
        container.innerHTML = `
            <div class="space-y-2">
                ${data.map(item => `
                    <div class="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs">
                        <div>
                            <p class="font-bold text-slate-800">${item.Keterangan || '-'}</p>
                            <p class="text-[10px] text-gray-400">${item.Tanggal || '-'}</p>
                        </div>
                        <span class="font-black ${item.Jenis === 'Masuk' ? 'text-emerald-600' : 'text-rose-600'}">
                            ${item.Jenis === 'Masuk' ? '+' : '-'} Rp ${parseInt(item.Jumlah || 0).toLocaleString()}
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
    });
}
