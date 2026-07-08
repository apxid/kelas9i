// Scripts.js - Multi-file Router Engine
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];
let currentSiswaIndex = -1;
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => {
  switchView('dashboard');
});

function switchView(viewName) {
  appState.currentView = viewName;
  
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const screenContainer = document.getElementById('active-view');
  screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

  fetch(`${viewName}.html`)
    .then(res => res.ok ? res.text() : Promise.reject())
    .then(html => {
      screenContainer.innerHTML = html;
      if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
      if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
      if (viewName === 'profilSiswa') checkPinAksesProfil();
    })
    .catch(() => screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500">Gagal memuat halaman.</p>`);
}

// ================== PROFIL SISWA LOGIC ==================
function renderDetailProfilSiswa(nisnSelected) {
  const container = document.getElementById('detail-profil-container');
  const placeholder = document.getElementById('profil-placeholder');
  
  if (!nisnSelected) {
    container?.classList.add('hidden');
    placeholder?.classList.remove('hidden');
    return;
  }

  currentSiswaIndex = masterSidata.findIndex(item => (item.NISN || item.nisn || "").toString().trim() === nisnSelected.toString().trim());
  if (currentSiswaIndex === -1) return;

  const s = masterSidata[currentSiswaIndex];
  placeholder?.classList.add('hidden');
  container?.classList.remove('hidden');

  // Daftar Field Utama
  const fields = [
    'No Absen', 'Kelas', 'Nama Lengkap', 'Nama Panggilan', 'Jenis Kelamin', 
    'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'No WA Siswa', 'No WA Ortu', 
    'Prestasi Ringkas', 'Hobi', 'Cita-cita', 'NIS', 'NISN', 'Pelajaran Disukai', 
    'Pelajaran Tidak Disukai', 'Ekskul', 'Kegiatan Motivasi', 'Cara Belajar', 
    'Nama Ayah', 'Pekerjaan Ayah', 'Pendidikan Ayah', 'Nama Ibu', 'Pekerjaan Ibu', 
    'Pendidikan Ibu', 'Punya KIP', 'Status Yatim Piatu', 'Riwayat Sakit'
  ];

  fields.forEach(field => {
    // ID di HTML menggunakan underscore untuk spasi
    const elementId = `prof-${field.replace(/\s+/g, '_').replace(/-/g, '_')}`;
    const targetEl = document.getElementById(elementId);
    if (targetEl) {
      const val = s[field] || s[field.toLowerCase()] || s[field.replace(/\s/g, '_')];
      targetEl.innerText = (val !== undefined && val !== null && val !== "") ? val : "-";
    }
  });

  // FOTO
  const imgEl = document.getElementById('prof-Foto');
  if (imgEl) {
    const fotoUrl = s['Foto'] || s['foto'] || "";
    imgEl.src = (fotoUrl && fotoUrl.toString().trim().startsWith('http')) ? fotoUrl.trim() : 'https://via.placeholder.com/150x200?text=Tanpa+Foto';
  }
}

function loadDropdownDaftarSiswa() {
  const selectNode = document.getElementById('select-profil-siswa');
  if (!selectNode) return;

  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    masterSidata = data.sort((a, b) => (parseInt(a['No Absen'] || 99) - parseInt(b['No Absen'] || 99)));
    
    let optionsHtml = '<option value="">-- PILIH NAMA SISWA --</option>';
    masterSidata.forEach(s => {
      optionsHtml += `<option value="${s.NISN || s.nisn}">${s['Nama Lengkap'] || s.nama_lengkap || '-'}</option>`;
    });
    selectNode.innerHTML = optionsHtml;
  });
}

// ================== UTILITIES & BACKEND ==================
async function callBackend(actionName, parameterData = {}) {
  try {
    let url = `${BACKEND_URL}?action=${actionName}`;
    if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
    const r = await fetch(url);
    return await r.json();
  } catch (e) { console.error("Backend Error:", e); return []; }
}

function showAlert(title, msg) {
  const overlay = document.getElementById('custom-alert');
  if(overlay) {
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-msg').innerText = msg;
    overlay.classList.remove('opacity-0', 'pointer-events-none');
  }
}
