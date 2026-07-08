// Scripts.js - Multi-file Router Engine
// Pastikan BACKEND_URL diisi dengan Web App URL dari Google Apps Script Anda
const BACKEND_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];        
let currentSiswaIndex = -1;   
let isPinVerified = false;    

window.addEventListener('DOMContentLoaded', () => {
  switchView('dashboard');
});

// ================== ROUTER ENGINE ==================
function switchView(viewName) {
  appState.currentView = viewName;
  
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  fetch(`${viewName}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`Gagal memuat ${viewName}.html`);
      return res.text();
    })
    .then(htmlContent => {
      screenContainer.innerHTML = htmlContent;
      if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
      if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
      if (viewName === 'profilSiswa') checkPinAksesProfil();
    })
    .catch(err => {
      screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500 font-medium">Error: ${err.message}</p>`;
    });
}

// ================== REKAM JEJAK LOGIC ==================
function switchSubMenu(subName) {
  appState.currentSubMenu = subName;
  document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
  const activeSubBtn = document.getElementById(`subbtn-${subName}`);
  if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

  const subContainer = document.getElementById('sub-menu-content-container');
  subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';

  const loaders = { 'prestasi': loadDataPrestasiMenu3, 'informasi': loadDataInformasiMenu3, 'pelanggaran': loadDataPelanggaranMenu3, 'jadwal': loadDataJadwalMenu3 };
  if (loaders[subName]) loaders[subName](subContainer);
}

// ================== DATA FETCHING ==================
async function callBackend(actionName, parameterData = {}) {
  try {
    let url = `${BACKEND_URL}?action=${actionName}`;
    if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
    const r = await fetch(url);
    return await r.json();
  } catch (e) {
    console.error("Backend Error:", e);
  }
}

// ================== STATISTIK & GRAFIK ==================
function loadGrafikSiswa() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    let L = 0, P = 0;
    (data || []).forEach(s => {
      const jk = (s['Jenis Kelamin'] || s['JK'] || '').toString().toLowerCase().trim();
      if (['l', 'laki-laki', 'laki laki'].includes(jk)) L++;
      else if (['p', 'perempuan'].includes(jk)) P++;
    });
    
    const ctx = document.getElementById('chartJenisKelamin');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      plugins: [ChartDataLabels], // Mengaktifkan plugin datalabels
      data: { 
        labels: ['Laki-laki', 'Perempuan'], 
        datasets: [{ data: [L, P], backgroundColor: ['#0B409C', '#F4CE14'], borderWidth: 0 }] 
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { 
          legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } },
          datalabels: {
            color: '#fff',
            font: { weight: 'bold', size: 14 },
            formatter: (val) => val > 0 ? val : ''
          }
        } 
      }
    });
  });
}

// ================== PROFIL SISWA & SECURITY ==================
function checkPinAksesProfil() {
  const lockScreen = document.getElementById('pin-lock-screen');
  if (isPinVerified) lockScreen?.classList.add('hidden');
  else lockScreen?.classList.remove('hidden');
}

function verifikasiPinProfil() {
  const pin = document.getElementById('input-pin-akses').value.trim();
  showAlert('Memproses', 'Verifikasi...');
  fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${encodeURIComponent(pin)}`)
    .then(r => r.json())
    .then(res => {
      closeAlert();
      if (res.success) { isPinVerified = true; document.getElementById('pin-lock-screen').classList.add('hidden'); loadDropdownDaftarSiswa(); }
      else showAlert('Akses Ditolak', 'PIN Salah.');
    });
}

function renderDetailProfilSiswa(nisnSelected) {
  const s = masterSidata.find(item => (item.NISN || item.nisn || "").toString() === nisnSelected.toString());
  if (!s) return;
  document.getElementById('profil-placeholder').classList.add('hidden');
  document.getElementById('detail-profil-container').classList.remove('hidden');
  
  const fields = ['Nama Lengkap', 'Kelas', 'NISN', 'Alamat', 'Nama Ayah', 'Nama Ibu']; // Tambahkan field lain sesuai kebutuhan
  fields.forEach(f => {
    const el = document.getElementById(`prof-${f.replace(/\s+/g, '_')}`);
    if (el) el.innerText = s[f] || "-";
  });
}

// ================== UI HELPERS ==================
function showAlert(title, msg) {
  const overlay = document.getElementById('custom-alert');
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = msg;
  overlay.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlert() {
  document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none');
}
