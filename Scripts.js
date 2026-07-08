// Scripts.js - Multi-file Router Engine via Fetch HTTP
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];        // Menyimpan data BIODATA terurut di memori aplikasi global
let currentSiswaIndex = -1;   // Menyimpan indeks siswa yang sedang aktif dilihat
let isPinVerified = false;    // Status verifikasi PIN halaman profil dalam sesi aktif

window.addEventListener('DOMContentLoaded', () => {
  // Fungsi pembaruan jam dinonaktifkan karena elemen status bar telah dihilangkan dari index.html
  // runClock();
  // setInterval(runClock, 60000);
  
  switchView('dashboard'); // Membuka dashboard pertama kali
});

function runClock() {
  const now = new Date();
  const clockEl = document.getElementById('app-clock');
  if (clockEl) {
    clockEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
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
      if (viewName === 'profilSiswa') {
        // Jalankan pengecekan gerbang PIN keamanan backend
        checkPinAksesProfil();
      }
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
  if (subName === 'informasi') loadDataInformasiMenu3(subContainer);
  if (subName === 'pelanggaran') loadDataPelanggaranMenu3(subContainer);
  if (subName === 'jadwal') loadDataJadwalMenu3(subContainer);
}

// 🏆 PEMUAT DATA PRESTASI (Menu Rekam Jejak)
function loadDataPrestasiMenu3(container) {
  callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada log prestasi.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <div class="flex justify-between items-center mb-1">
          <span class="bg-blue-50 text-smpprimary px-2 py-0.5 rounded font-bold text-[9px] uppercase">${item.Jenis || 'Lomba'}</span>
          <span class="text-gray-400 text-[10px]">${item.Tanggal || ''}</span>
        </div>
        <h5 class="font-bold text-slate-800">${item['Nama Prestasi'] || item['nama_prestasi'] || '-'}</h5>
        <p class="text-gray-500 text-[11px] mt-0.5">Siswa (NISN): <span class="font-bold text-slate-700">${item.NISN || item.nisn || '-'}</span> | Tingkat: ${item.Tingkat || item.tingkat || '-'}</p>
        ${item['Lampiran URL'] || item['Campiran URL'] || item['lampiran_url'] ? `<a href="${item['Lampiran URL'] || item['Campiran URL'] || item['lampiran_url']}" target="_blank" class="text-smpprimary font-bold block mt-2 text-[10px]"><i class="fas fa-link mr-1"></i> Lihat Dokumen Lampiran</a>` : ''}
      </div>
    `).join('');
  });
}

// 📢 PEMUAT DATA PENGUMUMAN (Menu Rekam Jejak)
function loadDataInformasiMenu3(container) {
  callBackend('getData', { sheetName: 'INFORMASI' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada pengumuman kelas.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <b class="text-slate-800 text-sm block">${item.Judul || item.judul || ''}</b>
        <p class="text-gray-500 mt-1 leading-relaxed">${item.Isi || item.isi || ''}</p>
      </div>
    `).join('');
  });
}

// 🚨 PEMUAT DATA PELANGGARAN (Menu Rekam Jejak)
function loadDataPelanggaranMenu3(container) {
  callBackend('getData', { sheetName: 'PELANGGARAN' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Catatan kelas bersih dari pelanggaran.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs flex justify-between items-center">
        <div>
          <span class="text-gray-400 text-[10px] block">${item.Tanggal || item.tanggal || ''}</span>
          <b class="text-slate-800">NISN ${item.NISN || item.nisn || '-'}</b>
          <p class="text-gray-500">${item.Keterangan || item.Pelanggaran || item.keterangan || '-'}</p>
        </div>
        <span class="bg-rose-100 text-rose-700 font-extrabold px-2.5 py-1 rounded-xl text-[10px]">${item.Poin || item.poin || 0} Poin</span>
      </div>
    `).join('');
  });
}

// 📅 PEMUAT DATA JADWAL (Menu Rekam Jejak)
function loadDataJadwalMenu3(container) {
  callBackend('getData', { sheetName: 'JADWAL' }).then(data => {
    if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada agenda jadwal pelajaran.</p>'; return; }
    container.innerHTML = data.map(item => `
      <div class="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs flex justify-between">
        <span class="font-black text-smpprimary w-16 uppercase">${item.Hari || item.hari || '-'}</span>
        <div class="flex-1 pl-2 border-l border-gray-100">
          <b class="text-slate-800">${item.Pelajaran || item.pelajaran || '-'}</b>
          <p class="text-gray-400 text-[10px]">${item.Jam || item.jam || ''} | Guru: ${item.Guru || item.guru || '-'}</p>
        </div>
      </div>
    `).join('');
  });
}

// ================== UTAMA MENU PROFIL SISWA ==================

// Mengisi list nama siswa ke elemen dropdown <select> dan mengurutkan berdasarkan nomor absen
function loadDropdownDaftarSiswa() {
  const selectNode = document.getElementById('select-profil-siswa');
  if (!selectNode) return;

  selectNode.innerHTML = '<option value="">-- Memuat Data Siswa... --</option>';
  
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    if (!data || data.length === 0) {
      selectNode.innerHTML = '<option value="">Gagal atau Data BIODATA kosong</option>';
      return;
    }
    
    // Proteksi pengurutan: Toleransi variasi penulisan kolom nomor absen di spreadsheet
    data.sort((a, b) => {
      const absA = parseInt(a['No Absen'] || a['no_absen'] || a['Absen'] || 99);
      const absB = parseInt(b['No Absen'] || b['no_absen'] || b['Absen'] || 99);
      return absA - absB;
    });
    
    masterSidata = data; // Simpan data terurut ke dalam memori aplikasi global

    let optionsHtml = '<option value="">-- PILIH NAMA SISWA --</option>';
    data.forEach(siswa => {
      const nisn = siswa.NISN || siswa.nisn || "";
      const nama = siswa['Nama Lengkap'] || siswa['nama_lengkap'] || siswa['Nama'] || "-";
      const absen = siswa['No Absen'] || siswa['no_absen'] || siswa['Absen'] || "-";
      
      optionsHtml += `<option value="${nisn}">Absen ${absen} : ${nama}</option>`;
    });
    selectNode.innerHTML = optionsHtml;
    
    // Jika sebelumnya sudah ada profil terpilih, kembalikan posisi fokus dropdown-nya
    if (currentSiswaIndex !== -1 && masterSidata[currentSiswaIndex]) {
      const savedNisn = masterSidata[currentSiswaIndex].NISN || masterSidata[currentSiswaIndex].nisn;
      selectNode.value = savedNisn;
    }
  }).catch(err => {
    console.error("Error loadDropdownDaftarSiswa:", err);
    selectNode.innerHTML = '<option value="">Terjadi kesalahan koneksi sistem</option>';
  });
}

// Memetakan (mapping) seluruh data isian kolom ke form detail profil halaman
function renderDetailProfilSiswa(nisnSelected) {
  const container = document.getElementById('detail-profil-container');
  const placeholder = document.getElementById('profil-placeholder');
  const selectNode = document.getElementById('select-profil-siswa');

  if (!nisnSelected) {
    currentSiswaIndex = -1;
    if (container) container.classList.add('hidden');
    if (placeholder) placeholder.classList.remove('hidden');
    return;
  }

  // Cari posisi indeks siswa aktif di memori data masterSidata berdasarkan NISN (Akurasi String)
  currentSiswaIndex = masterSidata.findIndex(item => {
    const itemNisn = item.NISN || item.nisn || "";
    return itemNisn.toString().trim() === nisnSelected.toString().trim();
  });
  
  if (currentSiswaIndex === -1) return;
  const s = masterSidata[currentSiswaIndex];

  if (placeholder) placeholder.classList.add('hidden');
  if (container) container.classList.remove('hidden');
  if (selectNode) selectNode.value = nisnSelected; // Sinkronkan nilai dropdown atas jika terpicu tombol navigasi

  // Daftar nama kolom di Spreadsheet dan ID padanannya di HTML
  const fields = [
    'No Absen', 'Kelas', 'Nama Lengkap', 'Nama Panggilan', 'Jenis Kelamin', 
    'Tempat Lahir', 'Tanggal Lahir', 'Alamat', 'No WA Siswa', 'No WA Ortu', 
    'Prestasi Ringkas', 'Hobi', 'Cita-cita', 'NIS', 'NISN', 'Pelajaran Disukai', 
    'Pelajaran Tidak Disukai', 'Ekskul', 'Kegiatan Motivasi', 'Cara Belajar', 
    'Nama Ayah', 'Pekerjaan Ayah', 'Pendidikan Ayah', 'Nama Ibu', 'Pekerjaan Ibu', 
    'Pendidikan Ibu', 'Topik Sering Dibicarakan', 'Harapan Orang Tua', 'Punya KIP', 
    'Status Yatim Piatu', 'Riwayat Sakit'
  ];

  fields.forEach(field => {
    const elementId = `prof-${field.replace(/\s+/g, '_').replace(/-/g, '_')}`;
    const targetEl = document.getElementById(elementId);
    if (targetEl) {
      // Fleksibilitas pengecekan data properti (Case-Insensitive Fallback)
      const val = s[field] !== undefined ? s[field] : s[field.toLowerCase()];
      targetEl.innerText = val !== undefined && val !== "" ? val : "-";
    }
  });

  // FOTO SISWA: Mengambil data tautan URL dari kolom Foto (di sheet BIODATA)
  const imgEl = document.getElementById('prof-Foto');
  if (imgEl) {
    const fotoUrl = s['Foto'] || s['foto'] || "";
    if (fotoUrl && fotoUrl.toString().trim().startsWith('http')) {
      imgEl.src = fotoUrl.toString().trim();
    } else {
      imgEl.src = 'https://via.placeholder.com/150x200?text=Tanpa+Foto';
    }
  }
}

// Logika Tombol Navigasi Geser (Prev & Next) Berdasarkan Urutan Absen
function navigateProfilSiswa(direction) {
  if (masterSidata.length === 0 || currentSiswaIndex === -1) return;

  // Tentukan target indeks berikutnya
  let nextIndex = currentSiswaIndex + direction;

  // Batasan limitasi urutan siswa teratas dan terbawah
  if (nextIndex < 0) {
    showAlert('Info', 'Ini adalah profil siswa dengan nomor absen pertama.');
    return;
  }
  if (nextIndex >= masterSidata.length) {
    showAlert('Info', 'Ini adalah profil siswa dengan nomor absen terakhir.');
    return;
  }

  // Tampilkan detail profil siswa target berikutnya
  const targetSiswa = masterSidata[nextIndex];
  const targetNisn = targetSiswa.NISN || targetSiswa.nisn;
  renderDetailProfilSiswa(targetNisn);
}

// ================== LOGIKA PENGAMANAN PIN PROFIL SISWA (BACKEND SECURE) ==================
function checkPinAksesProfil() {
  const lockScreen = document.getElementById('pin-lock-screen');
  if (!lockScreen) return;

  if (isPinVerified) {
    // Jika sesi sebelumnya sudah sukses verifikasi PIN, langsung buka kunci data
    lockScreen.classList.add('hidden');
    loadDropdownDaftarSiswa();
  } else {
    // Jika belum terverifikasi dalam sesi ini, tampilkan form pop-up PIN lock
    lockScreen.classList.remove('hidden');
    setTimeout(() => {
      const pinInput = document.getElementById('input-pin-akses');
      if (pinInput) pinInput.focus();
    }, 200);
  }
}

function verifikasiPinProfil() {
  const pinInput = document.getElementById('input-pin-akses');
  const lockScreen = document.getElementById('pin-lock-screen');
  
  if (!pinInput || !lockScreen) return;
  const nilaiPin = pinInput.value.trim();

  if (nilaiPin === "") {
    showAlert('Perhatian', 'PIN tidak boleh kosong.');
    return;
  }

  showAlert('Memproses', 'Memverifikasi kode keamanan...');

  // Kirim verifikasi pin dengan aman langsung ke Google Apps Script Engine
  fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${encodeURIComponent(nilaiPin)}`)
    .then(response => response.json())
    .then(res => {
      closeAlert(); // Menghapus/menutup popup loading 'Memproses'
      
      if (res.success) {
        isPinVerified = true;
        lockScreen.classList.add('hidden');
        pinInput.value = "";
        loadDropdownDaftarSiswa(); // Muat data siswa setelah izin dikonfirmasi server
      } else {
        showAlert('Akses Ditolak', 'PIN yang Anda masukkan salah.');
        pinInput.value = "";
        pinInput.focus();
      }
    })
    .catch(err => {
      console.error("Gagal melakukan verifikasi PIN:", err);
      showAlert('Error Sistem', 'Gagal terhubung ke modul keamanan server.');
    });
}

// ================== ATRIBUT KONTROL UTAMA BERANDA ==================
function loadInfoKelasBeranda() {
  callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
    if (!data) return;
    data.forEach(item => {
      // Mengubah spasi komponen menjadi underscore untuk kecocokan ID di HTML (Contoh: BENDAHARA 1 -> BENDAHARA_1)
      const elementId = item.KOMPONEN.replace(/\s+/g, '_');
      const wrapper = document.getElementById(`wrapper-${elementId}`);
      const valContainer = document.getElementById(`val-${elementId}`);
      
      if (wrapper && item.STATUS === 'ACTIVE') {
        wrapper.classList.remove('hidden');
        if (valContainer) {
          if (item.KOMPONEN === 'LOGO') { 
            document.getElementById('val-LOGO').src = item.VALUE; 
          } else { 
            valContainer.innerText = item.VALUE; 
          }
        }
      }
    });
  });
}

function loadGrafikSiswa() {
  callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
    let L = 0, P = 0;
    (data || []).forEach(s => {
      const jkField = s['Jenis Kelamin'] || s['jenis_kelamin'] || s['JK'] || '';
      const jk = jkField.toString().toLowerCase().trim();
      if (jk === 'laki-laki' || jk === 'l' || jk === 'laki laki') L++;
      else if (jk === 'perempuan' || jk === 'p') P++;
    });
    
    const ctx = document.getElementById('chartJenisKelamin');
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: { 
        labels: ['Laki-laki', 'Perempuan'], 
        datasets: [{ data: [L, P], backgroundColor: ['#0B409C', '#F4CE14'], borderWidth: 2 }] 
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } } } 
      }
    });
  });
}

function submitFormBiodata() {
  const form = document.getElementById('main-bio-form');
  const formDataObj = {};
  new FormData(form).forEach((value, key) => { formDataObj[key] = value; });
  showAlert('Memproses', 'Sedang menyimpan biodata...');
  
  fetch(`${BACKEND_URL}?action=submitBiodata&formData=${encodeURIComponent(JSON.stringify(formDataObj))}`)
    .then(r => r.json())
    .then(res => { 
      if (res.success) { 
        showAlert('Berhasil', res.message); 
        form.reset(); 
      } 
    })
    .catch(e => showAlert('Error', 'Gagal memproses.'));
}

async function callBackend(actionName, parameterData = {}) {
  try {
    let url = `${BACKEND_URL}?action=${actionName}`;
    if (actionName === 'getData') url += `&sheetName=${parameterData.sheetName}`;
    const r = await fetch(url, { method: "GET" }); 
    return await r.json();
  } catch (e) { 
    console.error("Backend Error:", e); 
  }
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
