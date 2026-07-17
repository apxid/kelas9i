// Scripts.js - Multi-file Router Engine via Fetch HTTP
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];
let currentSiswaIndex = -1;
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => { switchView('dashboard'); });

// Fungsi Inti Memuat File HTML
function switchView(viewName) {
    appState.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const screenContainer = document.getElementById('active-view');
    screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

    fetch(`${viewName}.html`)
        .then(response => { if (!response.ok) throw new Error(`Gagal memuat ${viewName}.html`); return response.text(); })
        .then(htmlContent => {
            screenContainer.innerHTML = htmlContent;
            if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
            if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
            if (viewName === 'profilSiswa') checkPinAksesProfil();
        })
        .catch(err => { screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500">Error: ${err.message}</p>`; });
}

// LOGIKA SUB-MENU BARU
function scrollMenu(direction) {
    const container = document.getElementById('scroll-container');
    container.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
}

function switchSubMenu(subName) {
    appState.currentSubMenu = subName;
    document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
    
    const activeSubBtn = document.getElementById(`subbtn-${subName}`);
    if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

    const subContainer = document.getElementById('sub-menu-content-container');
    subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';

    // Router Sub-Menu
    if (subName === 'prestasi') loadDataPrestasiMenu3(subContainer);
    else if (subName === 'informasi') loadDataInformasiMenu3(subContainer);
    else if (subName === 'pelanggaran') loadDataPelanggaranMenu3(subContainer);
    else if (subName === 'jadwal') loadDataJadwalMenu3(subContainer);
    else if (subName === 'jadwal-piket') loadDataPiketMenu3(subContainer);
}

// 🧹 PEMUAT DATA JADWAL PIKET (FUNGSI BARU)
function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { 
            container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data piket kosong.</p>'; 
            return; 
        }
        container.innerHTML = `
            <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-slate-700">Jadwal Piket Kelas</div>
                ${data.map(item => `
                    <div class="flex justify-between items-center px-4 py-3 border-b border-gray-50 text-xs">
                        <span class="font-bold text-smpprimary uppercase w-20">${item.Hari || item.hari || '-'}</span>
                        <span class="text-slate-600 flex-1 text-right">${item['Nama Siswa'] || item.nama_siswa || item.Nama || '-'}</span>
                    </div>
                `).join('')}
            </div>`;
    });
}

// FUNGSI LAINNYA (Prestasi, Informasi, Pelanggaran, Jadwal, Profil, dll tetap sama)
// ... (Pastikan sisa fungsi dari loadDataPrestasiMenu3 sampai ke bawah tetap ada di file Anda)
