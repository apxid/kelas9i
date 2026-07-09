// Scripts.js - Update Stabil 2026

let masterSidata = [];

// Fungsi Pindah Halaman
function switchView(viewName) {
  const container = document.getElementById('active-view');
  container.innerHTML = '<div class="flex justify-center p-10"><div class="animate-spin w-8 h-8 border-4 border-smpprimary rounded-full border-t-transparent"></div></div>';

  fetch(`${viewName}.html`)
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      if (viewName === 'dashboard') loadInfoKelasBeranda();
      if (viewName === 'profilSiswa') loadDropdownDaftarSiswa();
    });
}

// Fungsi Muat Logo (Beranda)
function loadInfoKelasBeranda() {
  callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
    data.forEach(item => {
      const el = document.getElementById(`wrapper-${item.KOMPONEN}`);
      if (el && item.STATUS === 'ACTIVE') {
        el.classList.remove('hidden');
        if (item.KOMPONEN === 'LOGO') document.getElementById('val-LOGO').src = item.VALUE;
        else {
          const valEl = document.getElementById(`val-${item.KOMPONEN}`);
          if (valEl) valEl.innerText = item.VALUE;
        }
      }
    });
  });
}

// Fungsi Dropdown Profil
function loadDropdownDaftarSiswa() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    masterSidata = data;
    const select = document.getElementById('select-profil-siswa');
    select.innerHTML = '<option value="">-- PILIH NAMA --</option>' + 
      data.map(s => `<option value="${s.NISN}">${s['Nama Lengkap']}</option>`).join('');
  });
}

// Fungsi Render Profil (Otomatis menyesuaikan kolom Sheet)
function renderDetailProfilSiswa(nisn) {
  const s = masterSidata.find(x => x.NISN == nisn);
  if (!s) return;
  
  // Menampilkan container detail
  document.getElementById('detail-profil-container').classList.remove('hidden');
  
  // Loop otomatis untuk setiap kolom di sheet
  Object.keys(s).forEach(key => {
    const el = document.getElementById(`prof-${key.replace(/\s+/g, '_')}`);
    if (el) el.innerText = s[key];
  });
  
  // Update Foto
  const foto = document.getElementById('prof-Foto');
  if (foto) foto.src = s['Foto'] || 'https://via.placeholder.com/150';
}

// Fungsi Kontrol Asisten dari Iframe
function closeAssistant() {
  switchView('dashboard');
}

// Backend Caller
async function callBackend(action, params) {
  const url = `${BACKEND_URL}?action=${action}&sheetName=${params.sheetName}`;
  return await (await fetch(url)).json();
}
