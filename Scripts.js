// Scripts.js - Multi-file Router Engine & PWA Controller

let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = []; 
let currentSiswaIndex = -1;
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => {
  switchView('dashboard');
});

// Fungsi Inti Memuat File HTML Secara Dinamis
function switchView(viewName) {
  appState.currentView = viewName;
  
  // Highlight tombol navigasi bawah aktif
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  fetch(`${viewName}.html`)
    .then(response => {
      if (!response.ok) throw new Error(`Gagal memuat ${viewName}.html`);
      return response.text();
    })
    .then(htmlContent => {
      screenContainer.innerHTML = htmlContent;
      if (viewName === 'dashboard') {
        loadInfoKelasBeranda();
        loadGrafikSiswa();
      }
      if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
      if (viewName === 'profilSiswa') checkPinAksesProfil();
    })
    .catch(err => {
      screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500 font-medium">Error: ${err.message}</p>`;
    });
}

// Fungsi Muat Iframe (Aplikasi Kas & Asisten)
function switchViewExternal(url) {
  const container = document.getElementById('active-view');
  const isAssistant = url.includes('assistant_v2');
  
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  
  container.innerHTML = `
    <div class="h-full w-full relative">
      <iframe id="ext-frame" src="${url}" class="w-full h-full border-none" style="min-height: 80vh;"></iframe>
    </div>
  `;

  if (isAssistant) {
    const frame = document.getElementById('ext-frame');
    frame.onload = function() {
      // Menyuntikkan CSS untuk menyembunyikan header/nav aplikasi asisten agar terasa native
      const style = document.createElement('style');
      style.textContent = '.header, .sidebar, .nav, footer { display: none !important; }';
      try { frame.contentDocument.head.appendChild(style); } catch(e) {}
    };
  }
}

// Fungsi Reset Cache PWA
async function clearAppCache() {
  if (confirm("Reset aplikasi untuk memperbaiki error tampilan?")) {
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));
    const regs = await navigator.serviceWorker.getRegistrations();
    for (let reg of regs) await reg.unregister();
    window.location.reload(true);
  }
}

// ================== LOGIKA SUB-MENU REKAM JEJAK ==================
function switchSubMenu(subName) {
  appState.currentSubMenu = subName;
  document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
  const activeSubBtn = document.getElementById(`subbtn-${subName}`);
  if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

  const subContainer = document.getElementById('sub-menu-content-container');
  subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';

  if (subName === 'prestasi') loadDataPrestasiMenu3(subContainer);
  if (subName === 'informasi') loadDataInformasiMenu3(subContainer);
  if (subName === 'pelanggaran') loadDataPelanggaranMenu3(subContainer);
  if (subName === 'jadwal') loadDataJadwalMenu3(subContainer);
}

function loadDataPrestasiMenu3(container) {
  callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada data.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <div class="flex justify-between items-center mb-1">
          <span class="bg-blue-50 text-smpprimary px-2 py-0.5 rounded font-bold text-[9px] uppercase">${item.Jenis || 'Lomba'}</span>
          <span class="text-gray-400 text-[10px]">${item.Tanggal || ''}</span>
        </div>
        <h5 class="font-bold text-slate-800">${item['Nama Prestasi'] || '-'}</h5>
      </div>
    `).join('');
  });
}

function loadDataInformasiMenu3(container) {
  callBackend('getData', { sheetName: 'INFORMASI' }).then(data => {
    container.innerHTML = data.map(item => `<div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs"><b>${item.Judul || ''}</b><p>${item.Isi || ''}</p></div>`).join('');
  });
}

function loadDataPelanggaranMenu3(container) {
  callBackend('getData', { sheetName: 'PELANGGARAN' }).then(data => {
    container.innerHTML = data.map(item => `<div class="p-4 bg-white border border-gray-100 rounded-2xl text-xs">${item.Keterangan || '-'} (${item.Poin || 0} Poin)</div>`).join('');
  });
}

function loadDataJadwalMenu3(container) {
  callBackend('getData', { sheetName: 'JADWAL' }).then(data => {
    container.innerHTML = data.map(item => `<div class="p-3 bg-white border border-gray-100 rounded-xl text-xs"><b>${item.Hari || '-'}</b>: ${item.Pelajaran || '-'}</div>`).join('');
  });
}

// ================== PROFIL & BACKEND ==================
function loadDropdownDaftarSiswa() {
  const selectNode = document.getElementById('select-profil-siswa');
  if (!selectNode) return;
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    masterSidata = data;
    let options = '<option value="">-- PILIH NAMA --</option>';
    data.forEach(s => options += `<option value="${s.NISN}">${s['Nama Lengkap']}</option>`);
    selectNode.innerHTML = options;
  });
}

function renderDetailProfilSiswa(nisn) {
  const s = masterSidata.find(x => x.NISN == nisn);
  if (!s) return;
  document.getElementById('prof-Nama_Lengkap').innerText = s['Nama Lengkap'];
  document.getElementById('prof-Foto').src = s['Foto'] || 'https://via.placeholder.com/150';
}

function checkPinAksesProfil() {
  const lockScreen = document.getElementById('pin-lock-screen');
  if (isPinVerified) lockScreen.classList.add('hidden');
  else lockScreen.classList.remove('hidden');
}

function verifikasiPinProfil() {
  const pin = document.getElementById('input-pin-akses').value;
  fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${pin}`)
    .then(r => r.json())
    .then(res => {
      if (res.success) { isPinVerified = true; checkPinAksesProfil(); loadDropdownDaftarSiswa(); }
      else showAlert('Akses', 'PIN Salah');
    });
}

function loadInfoKelasBeranda() {
  callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
    data.forEach(item => {
      const el = document.getElementById(`wrapper-${item.KOMPONEN.replace(/\s+/g, '_')}`);
      if (el && item.STATUS === 'ACTIVE') {
        el.classList.remove('hidden');
        const val = document.getElementById(`val-${item.KOMPONEN.replace(/\s+/g, '_')}`);
        if (val) val.innerText = item.VALUE;
      }
    });
  });
}

function loadGrafikSiswa() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    const ctx = document.getElementById('chartJenisKelamin');
    if (!ctx) return;
    new Chart(ctx, { type: 'doughnut', data: { labels: ['L', 'P'], datasets: [{ data: [10, 10], backgroundColor: ['#0B409C', '#F4CE14'] }] } });
  });
}

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
