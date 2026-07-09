// Scripts.js - Update Stabil 2026

let masterSidata = [];

// Fungsi Pindah Halaman Internal
function switchView(viewName) {
  setActiveNav(viewName);
  const container = document.getElementById('active-view');
  container.innerHTML = '<div class="flex justify-center p-10"><div class="animate-spin w-8 h-8 border-4 border-smpprimary rounded-full border-t-transparent"></div></div>';

  fetch(`${viewName}.html`)
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;
      if (viewName === 'dashboard') loadInfoKelasBeranda();
      if (viewName === 'profilSiswa') loadDropdownDaftarSiswa();
    })
    .catch(err => {
      container.innerHTML = `<p class="text-center p-5 text-red-500 text-xs">Gagal memuat halaman.</p>`;
    });
}

// Fungsi Pindah Halaman External (Iframe)
function switchViewExternal(url) {
  setActiveNav(null); // Reset highlight jika perlu
  const container = document.getElementById('active-view');
  container.innerHTML = `
    <iframe 
        src="${url}" 
        class="w-full h-full border-none" 
        style="width: 100%; height: 100%;"
        title="External Content">
    </iframe>
  `;
}

// Fungsi untuk menandai tombol navigasi aktif
function setActiveNav(target) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.remove('active', 'text-smpprimary');
    el.classList.add('text-gray-400');
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
    if (select) {
      select.innerHTML = '<option value="">-- PILIH NAMA --</option>' + 
        data.map(s => `<option value="${s.NISN}">${s['Nama Lengkap']}</option>`).join('');
    }
  });
}

// Fungsi Render Profil
function renderDetailProfilSiswa(nisn) {
  const s = masterSidata.find(x => x.NISN == nisn);
  if (!s) return;
  document.getElementById('detail-profil-container').classList.remove('hidden');
  Object.keys(s).forEach(key => {
    const el = document.getElementById(`prof-${key.replace(/\s+/g, '_')}`);
    if (el) el.innerText = s[key];
  });
  const foto = document.getElementById('prof-Foto');
  if (foto) foto.src = s['Foto'] || 'https://via.placeholder.com/150';
}

// Fungsi Backend Caller
async function callBackend(action, params) {
  const url = `${BACKEND_URL}?action=${action}&sheetName=${params.sheetName}`;
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.error("Backend Error:", err);
    return [];
  }
}

// Inisialisasi awal saat aplikasi dimuat
window.onload = () => switchView('dashboard');
