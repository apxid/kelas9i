// Scripts.js - Full Source Code - Cleaned & Optimized
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyK6wmxSpZ3tEG0Rar3BlGjp7z-3ZPhTB6NvdmNkx8QlNKSoqafhsY0c1ZAcEMbPyW1VQ/exec";

let masterSidata = []; 
let chartInstance = null;

// Pastikan aplikasi dimuat setelah DOM siap
window.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});

// 1. Fungsi Navigasi Utama (SPA)
function switchView(viewName) {
    const container = document.getElementById('active-view');
    if (!container) return;

    // Highlight nav
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Loading spinner
    container.innerHTML = '<div class="h-64 flex items-center justify-center"><div class="w-8 h-8 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

    fetch(`${viewName}.html`)
        .then(r => r.text())
        .then(html => {
            container.innerHTML = html;
            if (viewName === 'dashboard') { 
                loadInfoKelasBeranda(); 
                loadGrafikSiswa(); 
            } else if (viewName === 'profilSiswa') { 
                loadDropdownDaftarSiswa(); 
            }
        })
        .catch(err => { 
            container.innerHTML = `<p class="p-6 text-center text-xs text-rose-500">Gagal memuat: ${err.message}</p>`; 
        });
}

// 2. Fungsi Iframe SPA (Kas & Asisten)
function switchViewExternal(url) {
    const container = document.getElementById('active-view');
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    
    container.innerHTML = `
        <div class="h-full w-full relative flex items-center justify-center">
            <div id="loader" class="absolute w-8 h-8 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div>
            <iframe id="ext-frame" src="${url}" class="w-full h-full border-none opacity-0 transition-opacity duration-500" onload="this.classList.remove('opacity-0'); document.getElementById('loader').remove();"></iframe>
        </div>
    `;
}

// 3. Fungsi Close Iframe
function closeExternalView() {
    switchView('dashboard');
}

// 4. Logika Beranda (Logo & Info)
function loadInfoKelasBeranda() {
    callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
        if (!data || !Array.isArray(data)) return;
        data.forEach(item => {
            const el = document.getElementById(`wrapper-${item.KOMPONEN}`);
            if (el && item.STATUS === 'ACTIVE') {
                el.classList.remove('hidden');
                if (item.KOMPONEN === 'LOGO') {
                    const img = document.getElementById('val-LOGO');
                    if (img) img.src = item.VALUE;
                } else {
                    const valEl = document.getElementById(`val-${item.KOMPONEN}`);
                    if (valEl) valEl.innerText = item.VALUE;
                }
            }
        });
    });
}

// 5. Logika Grafik
function loadGrafikSiswa() {
    callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
        const ctx = document.getElementById('chartJenisKelamin');
        if (!ctx || !data) return;
        
        let lk = data.filter(s => (s['Jenis Kelamin']||'').toLowerCase().includes('l')).length;
        let pr = data.filter(s => (s['Jenis Kelamin']||'').toLowerCase().includes('p')).length;

        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: { labels: ['L', 'P'], datasets: [{ data: [lk, pr], backgroundColor: ['#0B409C', '#F4CE14'] }] }
        });
    });
}

// 6. Logika Profil Siswa
function loadDropdownDaftarSiswa() {
    callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
        if (!data) return;
        masterSidata = data;
        const select = document.getElementById('select-profil-siswa');
        if (select) {
            select.innerHTML = '<option value="">-- PILIH NAMA --</option>' + 
                data.map(s => `<option value="${s.NISN}">${s['Nama Lengkap']}</option>`).join('');
        }
    });
}

function renderDetailProfilSiswa(nisn) {
    const s = masterSidata.find(x => String(x.NISN) === String(nisn));
    if (!s) return;
    
    const container = document.getElementById('detail-profil-container');
    if (container) container.classList.remove('hidden');
    
    Object.keys(s).forEach(key => {
        const el = document.getElementById(`prof-${key.replace(/\s+/g, '_')}`);
        if (el) el.innerText = s[key] || "-";
    });
    
    const foto = document.getElementById('prof-Foto');
    if (foto) foto.src = s['Foto'] || s['foto'] || 'https://via.placeholder.com/150';
}

// 7. Backend & Utilities
async function callBackend(action, params) {
    try {
        const url = `${BACKEND_URL}?action=${action}&sheetName=${params.sheetName}`;
        const r = await fetch(url);
        return await r.json();
    } catch(e) { 
        console.error("Backend Error:", e); 
        return null;
    }
}

function showAlert(title, msg) {
    const alertBox = document.getElementById('custom-alert');
    if (!alertBox) return;
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-msg').innerText = msg;
    alertBox.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlert() {
    document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none');
}
