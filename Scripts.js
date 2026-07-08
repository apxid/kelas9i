// Scripts.js - Multi-file Router Engine via Fetch HTTP
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;

window.addEventListener('DOMContentLoaded', () => {
  runClock();
  setInterval(runClock, 60000);
  switchView('dashboard'); // Membuka dashboard pertama kali
});

function runClock() {
  const now = new Date();
  document.getElementById('app-clock').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// Fungsi Inti Memuat File HTML Secara Dinamis
function switchView(viewName) {
  appState.currentView = viewName;
  
  // Highlight tombol navigasi bawah aktif
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  // Membaca file HTML eksternal dari folder repositori GitHub Anda
  fetch(`${viewName}.html`)
    .then(response => {
      if (!response.ok) throw new Error(`Gagal memuat halaman ${viewName}.html`);
      return response.text();
    })
    .then(htmlContent => {
      screenContainer.innerHTML = htmlContent;
      
      // Inisialisasi data internal setelah komponen HTML sukses terpasang
      if (viewName === 'dashboard') {
        loadInfoKelasBeranda();
        loadGrafikSiswa();
      }
      if (viewName === 'informasiSiswa') {
        switchSubMenu(appState.currentSubMenu);
      }
    })
    .catch(err => {
      screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500 font-medium">Gagal memuat komponen sistem: ${err.message}</p>`;
    });
}

// ================== LOGIKA SUB-MENU HALAMAN KE-3 ==================
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

// 🏆 PEMUAT DATA PRESTASI (Menu 3)
function loadDataPrestasiMenu3(container) {
  callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada log prestasi.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <div class="flex justify-between items-center mb-1"><span class="bg-blue-50 text-smpprimary px-2 py-0.5 rounded font-bold text-[9px] uppercase">${item.Jenis || 'Lomba'}</span><span class="text-gray-400 text-[10px]">${item.Tanggal || ''}</span></div>
        <h5 class="font-bold text-slate-800">${item['Nama Prestasi'] || '-'}</h5>
        <p class="text-gray-500 text-[11px] mt-0.5">Siswa (NISN): <span class="font-bold text-slate-700">${item.NISN}</span> | Tingkat: ${item.Tingkat}</p>
        ${item['Lampiran URL'] ? `<a href="${item['Lampiran URL']}" target="_blank" class="text-smpprimary font-bold block mt-2 text-[10px]"><i class="fas fa-link mr-1"></i> Lihat Dokumen Lampiran</a>` : ''}
      </div>
    `).join('');
  });
}

// 📢 PEMUAT DATA PENGUMUMAN (Menu 3)
function loadDataInformasiMenu3(container) {
  callBackend('getData', { sheetName: 'INFORMASI' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada pengumuman kelas.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <b class="text-slate-800 text-sm block">${item.Judul || ''}</b>
        <p class="text-gray-500 mt-1 leading-relaxed">${item.Isi || ''}</p>
      </div>
    `).join('');
  });
}

// 🚨 PEMUAT DATA PELANGGARAN (Menu 3)
function loadDataPelanggaranMenu3(container) {
  callBackend('getData', { sheetName: 'PELANGGARAN' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Catatan kelas bersih dari pelanggaran.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs flex justify-between items-center">
        <div><span class="text-gray-400 text-[10px] block">${item.Tanggal || ''}</span><b class="text-slate-800">NISN ${item.NISN}</b><p class="text-gray-500">${item.Keterangan || item.Pelanggaran || '-'}</p></div>
        <span class="bg-rose-100 text-rose-700 font-extrabold px-2.5 py-1 rounded-xl text-[10px]">${item.Poin || 0} Poin</span>
      </div>
    `).join('');
  });
}

// 📅 PEMUAT DATA JADWAL (Menu 3)
function loadDataJadwalMenu3(container) {
  callBackend('getData', { sheetName: 'JADWAL' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada agenda jadwal pelajaran.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs flex justify-between">
        <span class="font-black text-smpprimary w-16 uppercase">${item.Hari || '-'}</span>
        <div class="flex-1 pl-2 border-l border-gray-100"><b class="text-slate-800">${item.Pelajaran || '-'}</b><p class="text-gray-400 text-[10px]">${item.Jam || ''} | Guru: ${item.Guru || '-'}</p></div>
      </div>
    `).join('');
  });
}

// ================== ATRIBUT KONTROL UTAMA BERANDA ==================
function loadInfoKelasBeranda() {
  callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
    if (!data) return;
    data.forEach(item => {
      const elementId = item.KOMPONEN.replace(/\s+/g, '_');
      const wrapper = document.getElementById(`wrapper-${elementId}`);
      const valContainer = document.getElementById(`val-${elementId}`);
      if (wrapper && item.STATUS === 'ACTIVE') {
        wrapper.classList.remove('hidden');
        if (valContainer) {
          if (item.KOMPONEN === 'LOGO') { document.getElementById('val-LOGO').src = item.VALUE; }
          else { valContainer.innerText = item.VALUE; }
        }
      }
    });
  });
}

function loadGrafikSiswa() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    let L = 0, P = 0;
    (data || []).forEach(s => {
      const jk = s['Jenis Kelamin'] ? s['Jenis Kelamin'].toString().toLowerCase() : '';
      if (jk === 'laki-laki' || jk === 'l') L++;
      else if (jk === 'perempuan' || jk === 'p') P++;
    });
    const ctx = document.getElementById('chartJenisKelamin');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { labels: ['Laki-laki', 'Perempuan'], datasets: [{ data: [L, P], backgroundColor: ['#0B409C', '#F4CE14'], borderWidth: 2 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } } } }
    });
  });
}

function submitFormBiodata() {
  const form = document.getElementById('main-bio-form');
  const formDataObj = {};
  new FormData(form).forEach((value, key) => { formDataObj[key] = value; });
  showAlert('Memproses', 'Sedang menyimpan biodata...', 'success');
  fetch(`${BACKEND_URL}?action=submitBiodata&formData=${encodeURIComponent(JSON.stringify(formDataObj))}`)
    .then(r => r.json())
    .then(res => { if (res.success) { showAlert('Berhasil', res.message, 'success'); form.reset(); } })
    .catch(e => showAlert('Error', 'Gagal memproses.', 'error'));
}

async function callBackend(actionName, parameterData = {}) {
  try {
    let url = `${BACKEND_URL}?action=${actionName}`;
    if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
    const r = await fetch(url, { method: "GET" }); return await r.json();
  } catch (e) { console.error(e); }
}

function showAlert(title, msg) {
  const overlay = document.getElementById('custom-alert');
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = msg;
  overlay.classList.remove('opacity-0', 'pointer-events-none');
}
function closeAlert() { document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none'); }
