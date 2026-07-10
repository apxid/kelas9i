// Scripts.js - V3 (Self-Healing System)
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };

// Fungsi Global untuk panggil API
async function callBackend(action, params = {}) {
    try {
        const url = `${BACKEND_URL}?action=${action}&sheetName=${params.sheetName || ''}`;
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error("Gagal panggil backend:", e);
        return [];
    }
}

// Navigasi Utama
function switchView(viewName) {
    const container = document.getElementById('active-view');
    fetch(`${viewName}.html`)
        .then(r => r.text())
        .then(html => {
            container.innerHTML = html;
            // Inisialisasi sesuai halaman
            if (viewName === 'dashboard') { initDashboard(); }
            if (viewName === 'informasiSiswa') { switchSubMenu('prestasi'); }
            if (viewName === 'profilSiswa') { checkPinAksesProfil(); }
        });
}

// Inisialisasi Dashboard Aman
function initDashboard() {
    loadInfoKelasBeranda();
    // Gunakan try-catch agar chart gagal tidak mematikan fungsi lain
    try { loadGrafikSiswa(); } catch(e) { console.log("Chart gagal dimuat"); }
}

// Logika PIN (Self-Checking)
function checkPinAksesProfil() {
    const lock = document.getElementById('pin-lock-screen');
    if (!lock) return;
    lock.classList.remove('hidden'); // Paksa muncul
}

function verifikasiPinProfil() {
    const pin = document.getElementById('input-pin-akses').value;
    fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${encodeURIComponent(pin)}`)
        .then(r => r.json())
        .then(res => {
            if (res.success) {
                document.getElementById('pin-lock-screen').classList.add('hidden');
                loadDropdownDaftarSiswa();
            } else {
                alert("PIN Salah");
            }
        });
}

// SubMenu Jejak (Logika Aman)
function switchSubMenu(kategori) {
    const container = document.getElementById('sub-menu-content-container');
    container.innerHTML = "Memuat...";
    callBackend('getData', { sheetName: kategori.toUpperCase() }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = "Data kosong"; return; }
        // Render data sederhana
        container.innerHTML = data.map(item => `
            <div class="p-3 bg-white mb-2 rounded shadow text-xs">
                ${JSON.stringify(item)}
            </div>`).join('');
    });
}
