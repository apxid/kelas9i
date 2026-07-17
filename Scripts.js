// Scripts.js - Multi-file Router Engine via Fetch HTTP
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
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  fetch(`${viewName}.html`)
    .then(response => { if (!response.ok) throw new Error(`Gagal memuat ${viewName}.html`); return response.text(); })
    .then(htmlContent => {
      screenContainer.innerHTML = htmlContent;
      if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
      if (viewName === 'informasiSiswa') { switchSubMenu(appState.currentSubMenu); }
      if (viewName === 'profilSiswa') { checkPinAksesProfil(); }
    })
    .catch(err => {
      screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500 font-medium">Gagal memuat komponen sistem: ${err.message}</p>`;
    });
}

// ================== LOGIKA SUB-MENU HALAMAN REKAM JEJAK ==================
function switchSubMenu(subName) {
  appState.currentSubMenu = subName;
  document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
  
  const activeSubBtn = document.getElementById(`subbtn-${subName}`);
  if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

  const subContainer = document.getElementById('sub-menu-content-container');
  subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';

  if (subName === 'prestasi') loadDataPrestasiMenu3(subContainer);
  else if (subName === 'informasi') loadDataInformasiMenu3(subContainer);
  else if (subName === 'pelanggaran') loadDataPelanggaranMenu3(subContainer);
  else if (subName === 'jadwal') loadDataJadwalMenu3(subContainer);
  else if (subName === 'jadwal-piket') loadDataPiketMenu3(subContainer);
}

// 🧹 PEMUAT DATA JADWAL PIKET (FUNGSI BARU)
function loadDataPiketMenu3(container) {
  callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
    if (!data || data.length === 0) { 
      container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data piket kosong.</p>'; return; 
    }
    container.innerHTML = `<div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs text-slate-700">Jadwal Piket Kelas</div>${data.map(item => `
      <div class="flex justify-between items-center px-4 py-3 border-b border-gray-50 text-xs">
        <span class="font-bold text-smpprimary uppercase w-20">${item.Hari || '-'}</span>
        <span class="text-slate-600 flex-1 text-right">${item['Nama Siswa'] || '-'}</span>
      </div>`).join('')}</div>`;
  });
}

// 🏆 PEMUAT DATA PRESTASI, INFORMASI, PELANGGARAN, JADWAL (Tetap)
function loadDataPrestasiMenu3(container) { callBackend('getData', { sheetName: 'PRESTASI' }).then(data => { if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada log prestasi.</p>'; return; } container.innerHTML = data.map(item => `<div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs mb-2"><b class="text-slate-800">${item['Nama Prestasi'] || '-'}</b></div>`).join(''); }); }
function loadDataInformasiMenu3(container) { callBackend('getData', { sheetName: 'INFORMASI' }).then(data => { if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada pengumuman.</p>'; return; } container.innerHTML = data.map(item => `<div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs mb-2"><b class="text-slate-800 text-sm block">${item.Judul || ''}</b><p class="text-gray-500 mt-1">${item.Isi || ''}</p></div>`).join(''); }); }
function loadDataPelanggaranMenu3(container) { callBackend('getData', { sheetName: 'PELANGGARAN' }).then(data => { if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Catatan bersih.</p>'; return; } container.innerHTML = data.map(item => `<div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs flex justify-between items-center"><div><b class="text-slate-800">NISN ${item.NISN || '-'}</b><p class="text-gray-500">${item.Keterangan || '-'}</p></div><span class="bg-rose-100 text-rose-700 font-bold px-2 py-1 rounded-xl text-[10px]">${item.Poin || 0} Poin</span></div>`).join(''); }); }
function loadDataJadwalMenu3(container) { callBackend('getData', { sheetName: 'JADWAL' }).then(data => { if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data jadwal kosong.</p>'; return; } container.innerHTML = data.map(item => `<div class="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs flex justify-between mb-2"><span class="font-black text-smpprimary w-16 uppercase">${item.Hari || '-'}</span><div class="flex-1 pl-2 border-l border-gray-100"><b class="text-slate-800">${item.Pelajaran || '-'}</b><p class="text-gray-400 text-[10px]">${item.Jam || ''} | Guru: ${item.Guru || '-'}</p></div></div>`).join(''); }); }

// FUNGSI PROFIL & LAINNYA (Tetap sesuai kode asli Anda)
function loadDropdownDaftarSiswa() { const selectNode = document.getElementById('select-profil-siswa'); if (!selectNode) return; callBackend('getData', { sheetName: 'BIODATA' }).then(data => { masterSidata = data; let optionsHtml = '<option value="">-- PILIH NAMA SISWA --</option>'; data.forEach(s => optionsHtml += `<option value="${s.NISN || s.nisn}">${s['Nama Lengkap'] || s.Nama}</option>`); selectNode.innerHTML = optionsHtml; }); }
function renderDetailProfilSiswa(nisnSelected) { const container = document.getElementById('detail-profil-container'); const s = masterSidata.find(item => (item.NISN || item.nisn) == nisnSelected); if (!s) return; container.classList.remove('hidden'); Object.keys(s).forEach(key => { const el = document.getElementById(`prof-${key.replace(/\s/g, '_')}`); if (el) el.innerText = s[key] || "-"; }); }
function checkPinAksesProfil() { const lockScreen = document.getElementById('pin-lock-screen'); if (isPinVerified) lockScreen.classList.add('hidden'); else lockScreen.classList.remove('hidden'); }
function verifikasiPinProfil() { const pin = document.getElementById('input-pin-akses').value; fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${pin}`).then(r => r.json()).then(res => { if (res.success) { isPinVerified = true; checkPinAksesProfil(); loadDropdownDaftarSiswa(); } else alert('PIN Salah!'); }); }
function loadInfoKelasBeranda() { callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => { data.forEach(item => { const el = document.getElementById(`val-${item.KOMPONEN.replace(/\s/g, '_')}`); if (el) el.innerText = item.VALUE; }); }); }
function loadGrafikSiswa() { callBackend('getData', { sheetName: 'BIODATA' }).then(data => { const L = data.filter(s => (s['Jenis Kelamin'] || '').toLowerCase() == 'l').length; const P = data.filter(s => (s['Jenis Kelamin'] || '').toLowerCase() == 'p').length; if (window.Chart) new Chart(document.getElementById('chartJenisKelamin'), { type: 'doughnut', data: { labels: ['Laki-laki', 'Perempuan'], datasets: [{ data: [L, P], backgroundColor: ['#0B409C', '#F4CE14'] }] } }); }); }
async function callBackend(actionName, parameterData = {}) { try { let url = `${BACKEND_URL}?action=${actionName}`; if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`; return await (await fetch(url)).json(); } catch (e) { console.error("Backend Error:", e); return []; } }
function showAlert(title, msg) { const overlay = document.getElementById('custom-alert'); document.getElementById('alert-title').innerText = title; document.getElementById('alert-msg').innerText = msg; overlay.classList.remove('opacity-0', 'pointer-events-none'); }
function closeAlert() { document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none'); }
