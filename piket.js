// --- File: piket.js ---

// Patch fungsi switchSubMenu agar mengenal 'jadwal-piket'
const originalSwitchSubMenu = window.switchSubMenu;
window.switchSubMenu = function(subName) {
    if (subName === 'jadwal-piket') {
        appState.currentSubMenu = 'jadwal-piket';
        document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
        const activeSubBtn = document.getElementById(`subbtn-${subName}`);
        if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

        const subContainer = document.getElementById('sub-menu-content-container');
        subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';
        
        loadDataPiketMenu3(subContainer);
    } else {
        originalSwitchSubMenu(subName);
    }
};

// Fungsi memuat data piket dengan pengambilan kolom dinamis
function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { 
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data piket kosong.</p>'; 
            return; 
        }

        // Logic Grouping Otomatis (Tidak peduli nama kolomnya)
        const grouped = data.reduce((acc, curr) => {
            const values = Object.values(curr);
            const hari = values[0]; // Kolom A
            const nama = values[1]; // Kolom B
            
            if (hari) {
                if (!acc[hari]) acc[hari] = [];
                // Memastikan data yang masuk bukan strip/kosong
                if (nama && nama !== "-") {
                    acc[hari].push(nama);
                }
            }
            return acc;
        }, {});

        // Rendering ke HTML
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
