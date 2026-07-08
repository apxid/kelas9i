// Scripts.js - Aplikasi State & API Fetch Gateway
let appState = { user: null, currentView: 'login' };

window.addEventListener('DOMContentLoaded', () => {
  runClock();
  setInterval(runClock, 60000);
  switchView('login');
});

function runClock() {
  const now = new Date();
  document.getElementById('app-clock').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function switchView(viewName) {
  if (!appState.user && viewName !== 'login') { viewName = 'login'; }
  appState.currentView = viewName;
  
  // Ambil template dari string di TemplateViews.js
  document.getElementById('active-view').innerHTML = TEMPLATE_VIEWS[viewName];
  
  const nav = document.getElementById('bottom-nav');
  if (viewName === 'login') {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const targetBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (targetBtn) targetBtn.classList.add('active');
  }

  if (viewName === 'dashboard') loadDashboardData();
  if (viewName === 'biodata') loadBiodataData();
  if (viewName === 'prestasi') loadPrestasiData();
  if (viewName === 'konseling') loadKonselingData();
}

// Fungsi Fetch Jembatan API ke GAS (Bypass CORS via POST text/plain)
async function callBackend(actionName, parameterData = {}) {
  try {
    const payload = { action: actionName, data: parameterData };
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    showAlert('Koneksi Gagal', 'Gagal terhubung dengan server API Google.', 'error');
    console.error(error);
  }
}

function handleLogin() {
  const nisn = document.getElementById('login-nisn').value.trim();
  const pwd = document.getElementById('login-pwd').value.trim();
  
  if (!nisn || !pwd) { showAlert('Gagal', 'Mohon isi kolom login.', 'error'); return; }

  callBackend('loginUser', { nisn: nisn, password: pwd }).then(res => {
    if (res && res.success) {
      appState.user = { nisn: res.nisn, role: res.role };
      showAlert('Berhasil', 'Selamat datang!', 'success');
      setTimeout(() => switchView('dashboard'), 1000);
    } else {
      showAlert('Akses Ditolak', res ? res.message : 'Kredensial salah', 'error');
    }
  });
}

function loadDashboardData() {
  document.getElementById('dash-username').innerText = "Siswa (" + appState.user.nisn + ")";
  callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
    const filtered = (data || []).filter(item => item.NISN.toString() === appState.user.nisn.toString());
    document.getElementById('count-prestasi').innerText = filtered.length;
  });
  callBackend('getData', { sheetName: 'INFORMASI' }).then(data => {
    const feed = document.getElementById('info-feed-container');
    feed.innerHTML = (data || []).map(i => `<div class="p-4 bg-white rounded-2xl shadow-sm text-xs"><b>${i.Judul}</b><p>${i.Isi}</p></div>`).join('');
  });
}

function loadBiodataData() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    const p = (data || []).find(item => item.NISN.toString() === appState.user.nisn.toString());
    if (p) {
      document.getElementById('bio-nama').innerText = p['Nama Lengkap'] || '-';
      document.getElementById('bio-nisn').innerText = p['NISN'] || '-';
      document.getElementById('bio-kelas').innerText = p['Kelas'] || '-';
      document.getElementById('bio-alamat').innerText = p['Alamat'] || '-';
    }
  });
}

function showAlert(title, msg, type = 'success') {
  const overlay = document.getElementById('custom-alert');
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = msg;
  overlay.classList.remove('opacity-0', 'pointer-events-none');
}
function closeAlert() { document.getElementById('custom-alert').add('opacity-0', 'pointer-events-none'); }
function toggleElement(id) { document.getElementById(id).classList.toggle('hidden'); }
