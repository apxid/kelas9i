// Scripts.js - Optimized & Stabilized Version

let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];
let currentSiswaIndex = -1;
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});

// Fungsi Utama Navigasi
function switchView(viewName) {
    appState.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const screenContainer = document.getElementById('active-view');
    if (!screenContainer) return;

    screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

    fetch(`${viewName}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`Gagal memuat ${viewName}.html`);
            return response.text();
        })
        .then(htmlContent => {
            screenContainer.innerHTML = htmlContent;
            
            // Inisialisasi spesifik per halaman
            if (viewName === 'dashboard') { 
                loadInfoKelasBeranda(); 
                // Tambahkan pengecekan Chart agar tidak crash jika library belum terload
                if (typeof Chart !== 'undefined') loadGrafikSiswa(); 
            }
            if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
            if (viewName === 'profilSiswa') checkPinAksesProfil();
        })
        .catch(err => {
            screenContainer.innerHTML = `<p class="p-6 text-center text-rose-500">Error: ${err.message}</p>`;
        });
}

// Fungsi Pindah ke Eksternal (Iframe)
function switchViewExternal(url) {
    const screenContainer = document.getElementById('active-view');
    screenContainer.innerHTML = `
        <div class="h-full w-full relative">
            <iframe src="${url}" class="w-full h-full border-none" sandbox="allow-scripts allow-forms allow-same-origin allow-popups"></iframe>
        </div>
    `;
}

// Fungsi Sub-Menu (Rekam Jejak)
function switchSubMenu(subName) {
    appState.currentSubMenu = subName;
    document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
    const activeSubBtn = document.getElementById(`subbtn-${subName}`);
    if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

    const subContainer = document.getElementById('sub-menu-content-container');
    if (!subContainer) return;
    
    subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';

    const loaders = {
        'prestasi': loadDataPrestasiMenu3,
        'informasi': loadDataInformasiMenu3,
        'pelanggaran': loadDataPelanggaranMenu3,
        'jadwal': loadDataJadwalMenu3
    };
    
    if (loaders[subName]) loaders[subName](subContainer);
}

// Backend Helper (Optimasi agar tidak error jika JSON kosong)
async function callBackend(actionName, parameterData = {}) {
    try {
        let url = `${BACKEND_URL}?action=${actionName}`;
        if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
        const r = await fetch(url);
        const data = await r.json();
        return data || []; 
    } catch (e) {
        console.error("Backend Error:", e);
        return [];
    }
}

// Fungsi Alert (Agar UI tetap responsif)
function showAlert(title, msg) {
    const overlay = document.getElementById('custom-alert');
    if(overlay) {
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-msg').innerText = msg;
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function closeAlert() {
    const overlay = document.getElementById('custom-alert');
    if(overlay) overlay.classList.add('opacity-0', 'pointer-events-none');
}

// [Fungsi lainnya seperti loadDropdownDaftarSiswa, renderDetailProfilSiswa, dll] 
// tetap sama seperti kode Anda sebelumnya karena sudah benar.
