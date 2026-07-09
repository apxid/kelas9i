// Scripts.js - Multi-file Router Engine & PWA Controller (Update 2026)

let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let masterSidata = []; 
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => {
  switchView('dashboard');
});

// 1. Fungsi Navigasi Utama (SPA)
function switchView(viewName) {
  appState.currentView = viewName;
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="h-64 flex items-center justify-center"><div class="w-8 h-8 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  fetch(`${viewName}.html`)
    .then(r => r.text())
    .then(html => {
      screenContainer.innerHTML = html;
      if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
      if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
      if (viewName === 'profilSiswa') checkPinAksesProfil();
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

  if (url.includes('assistant_v2')) {
    document.getElementById('ext-frame').onload = function() {
      const style = document.createElement('style');
      style.textContent = '.header, .sidebar, .nav, footer { display: none !important; }';
      try { this.contentDocument.head.appendChild(style); } catch(e) {}
    };
  }
}

// 3. Logika Profil Siswa
function renderDetailProfilSiswa(nisnSelected) {
  const container = document.getElementById('detail-profil-container');
  const placeholder = document.getElementById('profil-placeholder');

  if (!nisnSelected) {
    if (container) container.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
    return;
  }

  const s = masterSidata.find(item => (item.NISN || item.nisn || "").toString().trim() === nisnSelected.toString().trim());
  if (!s) return;

  if (placeholder) placeholder.classList.add('hidden');
  if (container) container.classList.remove('hidden');

  // Mapping data dinamis ke ID elemen (format ID: prof-Nama_Kolom)
  Object.keys(s).forEach(key => {
    const targetEl = document.getElementById(`prof-${key.replace(/\s+/g, '_')}`);
    if (targetEl) targetEl.innerText = s[key] || "-";
  });

  const imgEl = document.getElementById('prof-Foto');
  if (imgEl) imgEl.src = s['Foto'] || s['foto'] || 'https://via.placeholder.com/150';
}

// 4. Logika Beranda (Fix Logo)
function loadInfoKelasBeranda() {
  callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
    if (!data) return;
    data.forEach(item => {
      const key = item.KOMPONEN.replace(/\s+/g, '_');
      const wrapper = document.getElementById(`wrapper-${key}`);
      const val = document.getElementById(`val-${key}`);
      
      if (wrapper && item.STATUS === 'ACTIVE') {
        wrapper.classList.remove('hidden');
        if (val) {
          if (item.KOMPONEN === 'LOGO') {
            const logoImg = document.getElementById('val-LOGO');
            if (logoImg) logoImg.src = item.VALUE;
          } else {
            val.innerText = item.VALUE;
          }
        }
      }
    });
  });
}

// 5. Utilities
async function callBackend(actionName, parameterData = {}) {
  let url = `${BACKEND_URL}?action=${actionName}`;
  if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
  const r = await fetch(url);
  return await r.json();
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
