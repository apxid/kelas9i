// --- File: piket.js (Versi Injection) ---

// 1. Patch fungsi switchSubMenu agar mengenal 'jadwal-piket' tanpa mengubah file aslinya
const originalSwitchSubMenu = window.switchSubMenu;
window.switchSubMenu = function(subName) {
    if (subName === 'jadwal-piket') {
        // Logika khusus untuk piket
        appState.currentSubMenu = 'jadwal-piket';
        
        // Update UI tombol
        document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
        const activeSubBtn = document.getElementById(`subbtn-${subName}`);
        if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

        const subContainer = document.getElementById('sub-menu-content-container');
        subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';
        
        loadDataPiketMenu3(subContainer);
    } else {
        // Jalankan fungsi asli untuk menu lainnya
        originalSwitchSubMenu(subName);
    }
};

// 2. Fungsi pemuat data Piket
function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { 
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data piket kosong.</p>'; 
            return; 
        }
        container.innerHTML = `
            <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-slate-700">🧹 Jadwal Piket Kelas</div>
                ${data.map(item => `
                    <div class="flex justify-between items-center px-4 py-3 border-b border-gray-50 text-xs">
                        <span class="font-bold text-smpprimary uppercase w-20">${item.Hari || '-'}</span>
                        <span class="text-slate-600 flex-1 text-right">${item['Nama Siswa'] || '-'}</span>
                    </div>
                `).join('')}
            </div>`;
    });
}
