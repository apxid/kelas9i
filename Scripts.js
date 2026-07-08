// =========================================================================
// Scripts.js - Multi-file Router Engine
// Konfigurasi URL Backend (Ganti dengan URL Deployment Google Apps Script Anda)
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyK6wmxSpZ3tEG0Rar3BlGjp7z-3ZPhTB6NvdmNkx8QlNKSoqafhsY0c1ZAcEMbPyW1VQ/exec";

let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];        // Menyimpan data BIODATA
let currentSiswaIndex = -1;   // Indeks siswa aktif
let isPinVerified = false;    // Status kunci profil

// Inisialisasi saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});

// ================== ROUTER SISTEM ==================
function switchView(viewName) {
    appState.currentView = viewName;
    
    // Highlight menu
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const screenContainer = document.getElementById('active-view');
    screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

    fetch(`${viewName}.html`)
        .then(response => {
            if (!response.ok) throw new Error(`File ${viewName}.html tidak ditemukan.`);
            return response.text();
        })
        .then(htmlContent => {
            screenContainer.innerHTML = htmlContent;
            
            // Trigger inisialisasi berdasarkan halaman
            if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
            if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
            if (viewName === 'profilSiswa') checkPinAksesProfil();
        })
        .catch(err => {
            console.error("Router Error:", err);
            screenContainer.innerHTML = `<div class="p-6 text-center text-rose-500 font-bold text-xs">Gagal memuat sistem: ${err.message}<br>Pastikan file tersedia.</div>`;
        });
}

// ================== REKAM JEJAK (SUB-MENU) ==================
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

// ================== FUNGSI DATA FETCHING (BACKEND) ==================
async function callBackend(actionName, parameterData = {}) {
    try {
        let url = `${BACKEND_URL}?action=${actionName}`;
        if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
        const r = await fetch(url);
        return await r.json();
    } catch (e) {
        console.error("Backend Error:", e);
        return null;
    }
}

// ================== PROFIL SISWA & PIN LOGIC ==================
function checkPinAksesProfil() {
    if (isPinVerified) {
        loadDropdownDaftarSiswa();
    } else {
        document.getElementById('pin-lock-screen').classList.remove('hidden');
    }
}

function verifikasiPinProfil() {
    const pin = document.getElementById('input-pin-akses').value;
    showAlert('Memproses', 'Verifikasi...');
    
    callBackend('verifikasiPin', { pin: pin }).then(res => {
        closeAlert();
        if (res && res.success) {
            isPinVerified = true;
            document.getElementById('pin-lock-screen').classList.add('hidden');
            loadDropdownDaftarSiswa();
        } else {
            showAlert('Gagal', 'PIN Salah!');
        }
    });
}

function renderDetailProfilSiswa(nisnSelected) {
    const s = masterSidata.find(item => (item.NISN || item.nisn || "").toString() === nisnSelected.toString());
    if (!s) return;

    document.getElementById('detail-profil-container').classList.remove('hidden');
    document.getElementById('profil-placeholder').classList.add('hidden');

    const fields = [
        'No Absen', 'Kelas', 'Nama Lengkap', 'Nama Panggilan', 'Jenis Kelamin', 
        'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'No WA Siswa', 'No WA Ortu', 
        'Prestasi Ringkas', 'Hobi', 'Cita-cita', 'NIS', 'NISN', 'Pelajaran Disukai', 
        'Pelajaran Tidak Disukai', 'Ekskul', 'Kegiatan Motivasi', 'Cara Belajar', 
        'Nama Ayah', 'Pekerjaan Ayah', 'Pendidikan Ayah', 'Nama Ibu', 'Pekerjaan Ibu', 
        'Pendidikan Ibu', 'Punya KIP', 'Status Yatim Piatu', 'Riwayat Sakit'
    ];

    fields.forEach(f => {
        const id = `prof-${f.replace(/\s+/g, '_')}`;
        const el = document.getElementById(id);
        if (el) el.innerText = s[f] || s[f.toLowerCase()] || '-';
    });

    const img = document.getElementById('prof-Foto');
    if (img) img.src = s['Foto'] || s['foto'] || 'https://via.placeholder.com/150x200?text=No+Photo';
}

// ================== UI HELPER ==================
function showAlert(title, msg) {
    const overlay = document.getElementById('custom-alert');
    if(!overlay) return;
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-msg').innerText = msg;
    overlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlert() {
    document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none');
}
