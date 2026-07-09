// Scripts.js - Full Source Code
// URL WEB APP GOOGLE APPS SCRIPT (Pastikan ini sesuai dengan milik Anda)
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyK6wmxSpZ3tEG0Rar3BlGjp7z-3ZPhTB6NvdmNkx8QlNKSoqafhsY0c1ZAcEMbPyW1VQ/exec";

let masterSidata = []; 
let chartInstance = null;

window.addEventListener('DOMContentLoaded', () => {
  switchView('dashboard');
});

// 1. Fungsi Navigasi Utama (SPA)
function switchView(viewName) {
  const container = document.getElementById('active-view');
  
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
      if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
      if (viewName === 'profilSiswa') loadDropdownDaftarSiswa();
    })
    .catch(err => { container.innerHTML = `<p class="p-6 text-center text-xs text-rose-500">Error: ${err.message}</p>`; });
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

// 3. Fungsi Close Iframe (Panggil dari dalam Iframe via window.parent)
function closeExternalView() {
  switchView('dashboard');
}

// 4. Logika Beranda (Logo & Info)
function loadInfoKelasBeranda() {
  callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
    if (!data) return;
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
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['L', 'P'], datasets: [{ data: [10, 10], backgroundColor: ['#0B409C', '#F4CE14'] }] }
    });
  });
}

// 6. Logika Profil Siswa
function loadDropdownDaftarSiswa() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    masterSidata = data;
    const select = document.getElementById('select-profil-siswa');
    if (select) {
      select.innerHTML = '<option value="">-- PILIH NAMA --</option>' + 
        data.map(s => `<option value="${s.NISN}">${s['Nama Lengkap']}</option>`).join('');
    }
  });
}

function renderDetailProfilSiswa(nisn) {
  const s = masterSidata.find(x => x.NISN == nisn);
  if (!s) return;
  document.getElementById('detail-profil-container').classList.remove('hidden');
  
  Object.keys(s).forEach(key => {
    const el = document.getElementById(`prof-${key.replace(/\s+/g, '_')}`);
    if (el) el.innerText = s[key] || "-";
  });
  
  const foto = document.getElementById('prof-Foto');
  if (foto) foto.src = s['Foto'] || 'https://via.placeholder.com/150';
}

// 7. Backend & Utilities
async function callBackend(action, params) {
  try {
    const url = `${BACKEND_URL}?action=${action}&sheetName=${params.sheetName}`;
    const r = await fetch(url);
    return await r.json();
  } catch(e) { console.error("Backend Error:", e); }
}

function showAlert(title, msg) {
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = msg;
  document.getElementById('custom-alert').classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlert() {
  document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none');
}

async function clearAppCache() {
  if (confirm("Reset aplikasi untuk memperbaiki error?")) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));
    window.location.reload(true);
  }
}
