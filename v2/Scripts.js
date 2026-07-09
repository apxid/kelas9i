// Scripts.js - Multi-file Router Engine via Fetch HTTP

let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];
let currentSiswaIndex = -1;
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => {
  switchView('dashboard');
});

// ================== INTEGRASI APLIKASI EKSTERNAL (SPA) ==================

function openKas() {
  const container = document.getElementById('view-kas-container');
  const iframe = document.getElementById('iframe-kas');
  // Memuat URL jika belum ada
  if(!iframe.src) iframe.src = "https://apxid.github.io/kelas9i/kas/";
  container.classList.remove('hidden');
}

function closeKas() {
  document.getElementById('view-kas-container').classList.add('hidden');
}

function toggleChat() {
  const wrapper = document.getElementById('chat-wrapper');
  const iframe = document.getElementById('iframe-asisten');
  // Memuat URL jika belum ada
  if(!iframe.src) iframe.src = "https://apxid.github.io/assistant_v2/";
  wrapper.classList.toggle('hidden');
}

// ================== LOGIKA ROUTER UTAMA ==================

function switchView(viewName) {
  appState.currentView = viewName;
  
  // Highlight tombol navigasi bawah
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  fetch(`${viewName}.html`)
    .then(response => {
      if (!response.ok) throw new Error(`Gagal memuat halaman ${viewName}.html`);
      return response.text();
    })
    .then(htmlContent => {
      screenContainer.innerHTML = htmlContent;
      
      if (viewName === 'dashboard') {
        loadInfoKelasBeranda();
        loadGrafikSiswa();
      }
      if (viewName === 'informasiSiswa') {
        switchSubMenu(appState.currentSubMenu);
      }
      if (viewName === 'profilSiswa') {
        checkPinAksesProfil();
      }
    })
    .catch(err => {
      screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500 font-medium">Gagal memuat komponen sistem: ${err.message}</p>`;
    });
}

// ================== LOGIKA SUB-MENU & DATA ==================

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

// (Fungsi-fungsi loadDataPrestasiMenu3, loadDataInformasiMenu3, dll. tetap sama seperti kode Anda sebelumnya)
// ... [Simpan fungsi loadDataPrestasiMenu3, loadDataInformasiMenu3, loadDataPelanggaranMenu3, loadDataJadwalMenu3 Anda di sini] ...

// ================== LOGIKA PROFIL & KEAMANAN ==================

function loadDropdownDaftarSiswa() {
  const selectNode = document.getElementById('select-profil-siswa');
  if (!selectNode) return;
  selectNode.innerHTML = '<option value="">-- Memuat Data Siswa... --</option>';
  
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    if (!data || data.length === 0) { selectNode.innerHTML = '<option value="">Data Kosong</option>'; return; }
    data.sort((a, b) => parseInt(a['No Absen'] || a['Absen'] || 99) - parseInt(b['No Absen'] || b['Absen'] || 99));
    masterSidata = data;

    let optionsHtml = '<option value="">-- PILIH NAMA SISWA --</option>';
    data.forEach(siswa => {
      optionsHtml += `<option value="${siswa.NISN || siswa.nisn}">${siswa['Nama Lengkap'] || siswa['Nama'] || "-"}</option>`;
    });
    selectNode.innerHTML = optionsHtml;
  });
}

function renderDetailProfilSiswa(nisnSelected) {
  const container = document.getElementById('detail-profil-container');
  const placeholder = document.getElementById('profil-placeholder');
  
  if (!nisnSelected) {
    if (container) container.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
    return;
  }

  currentSiswaIndex = masterSidata.findIndex(item => (item.NISN || item.nisn).toString() === nisnSelected.toString());
  const s = masterSidata[currentSiswaIndex];

  if (placeholder) placeholder.classList.add('hidden');
  if (container) container.classList.remove('hidden');

  // Rendering data profil...
  // (Pastikan fungsi rendering kolom Anda tetap di sini)
}

function checkPinAksesProfil() {
  const lockScreen = document.getElementById('pin-lock-screen');
  if (!lockScreen) return;
  if (isPinVerified) {
    lockScreen.classList.add('hidden');
    loadDropdownDaftarSiswa();
  } else {
    lockScreen.classList.remove('hidden');
  }
}

function verifikasiPinProfil() {
  const pinInput = document.getElementById('input-pin-akses');
  const lockScreen = document.getElementById('pin-lock-screen');
  fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${encodeURIComponent(pinInput.value)}`)
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        isPinVerified = true;
        lockScreen.classList.add('hidden');
        loadDropdownDaftarSiswa();
      } else {
        showAlert('Akses Ditolak', 'PIN salah.');
      }
    });
}

// ================== FUNGSI UMUM ==================

async function callBackend(actionName, parameterData = {}) {
  try {
    let url = `${BACKEND_URL}?action=${actionName}`;
    if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
    const r = await fetch(url);
    return await r.json();
  } catch (e) { console.error(e); }
}

function showAlert(title, msg) {
  const overlay = document.getElementById('custom-alert');
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = msg;
  overlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlert() {
  document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none');
}
