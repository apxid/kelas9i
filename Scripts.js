// Scripts.js - Aplikasi State & API Fetch Gateway via GET
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

// Fungsi Fetch Jembatan API ke GAS (Bypass CORS via GET Query Parameters)
async function callBackend(actionName, parameterData = {}) {
  try {
    // Menyusun query parameter dasar ke dalam URL GET
    let url = `${BACKEND_URL}?action=${actionName}`;
    
    // Kondisional query string berdasarkan tipe aksi (action)
    if (actionName === 'loginUser') {
      url += `&nisn=${encodeURIComponent(parameterData.nisn)}&password=${encodeURIComponent(parameterData.password)}`;
    } else if (actionName === 'getData') {
      url += `&sheetName=${encodeURIComponent(parameterData.sheetName)}`;
    } else if (actionName === 'addData') {
      url += `&sheetName=${encodeURIComponent(parameterData.sheetName)}&data=${encodeURIComponent(JSON.stringify(parameterData.data))}`;
    }

    const response = await fetch(url, { method: "GET" });
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
  
  // Ambil data Poin Pelanggaran & total prestasi sekaligus untuk ringkasan di Beranda
  callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
    const filtered = (data || []).filter(item => item.NISN.toString() === appState.user.nisn.toString());
    const countBadge = document.getElementById('count-prestasi');
    if (countBadge) countBadge.innerText = filtered.length;
  });

  callBackend('getData', { sheetName: 'PELANGGARAN' }).then(data => {
    const filtered = (data || []).filter(item => item.NISN.toString() === appState.user.nisn.toString());
    let totalPoin = 0;
    filtered.forEach(item => totalPoin += parseInt(item.Poin || 0));
    const countBadge = document.getElementById('count-pelanggaran');
    if (countBadge) countBadge.innerText = totalPoin;
  });

  // Memuat data pengumuman ke dalam feed informasi
  const feed = document.getElementById('info-feed-container');
  if (feed) {
    feed.innerHTML = '<div class="shimmer h-16 rounded-2xl w-full"></div>';
    callBackend('getData', { sheetName: 'INFORMASI' }).then(data => {
      const activeInfo = (data || []).filter(i => i.Status.toString().toUpperCase() === 'AKTIF' || i.Status === true);
      if (activeInfo.length === 0) {
        feed.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada pengumuman terbaru.</p>';
        return;
      }
      feed.innerHTML = activeInfo.map(i => `
        <div class="p-4 bg-white rounded-2xl shadow-sm text-xs border border-gray-100">
          <span class="text-[10px] text-gray-400 font-bold block mb-1">${i.Tanggal || ''}</span>
          <b class="text-slate-800">${i.Judul || ''}</b>
          <p class="text-gray-500 mt-1 leading-relaxed">${i.Isi || ''}</p>
        </div>
      `).join('');
    });
  }
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

function loadPrestasiData() {
  const list = document.getElementById('prestasi-list-container');
  if (!list) return;
  list.innerHTML = '<div class="shimmer h-14 rounded-xl w-full"></div>';

  callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
    const filtered = (data || []).filter(item => item.NISN.toString() === appState.user.nisn.toString());
    if (filtered.length === 0) {
      list.innerHTML = '<p class="text-center text-xs text-gray-400 py-6">Belum ada riwayat prestasi.</p>';
      return;
    }
    list.innerHTML = filtered.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <div class="flex justify-between items-center mb-1">
          <span class="bg-blue-50 text-smpprimary px-2 py-0.5 rounded font-bold text-[9px] uppercase">${item.Jenis || 'Lomba'}</span>
          <span class="text-gray-400 text-[10px]">${item.Tanggal || ''}</span>
        </div>
        <h5 class="font-bold text-slate-800">${item['Nama Prestasi'] || '-'}</h5>
        <p class="text-gray-500 text-[11px] mt-0.5">Tingkat: <span class="font-semibold text-slate-700">${item.Tingkat || '-'}</span></p>
      </div>
    `).join('');
  });
}

function submitPrestasi() {
  const nama = document.getElementById('pres-form-nama').value.trim();
  if (!nama) { showAlert('Input Lemah', 'Nama lomba/prestasi wajib diisi.', 'error'); return; }

  const payload = {
    Tanggal: new Date().toISOString().split('T')[0],
    NISN: appState.user.nisn,
    Jenis: 'Akademik', // Nilai default bawaan form ringkas
    'Nama Prestasi': nama,
    Tingkat: 'Sekolah',
    Keterangan: 'Input mandiri via aplikasi mobile.'
  };

  callBackend('addData', { sheetName: 'PRESTASI', data: payload }).then(res => {
    if (res && res.success) {
      showAlert('Berhasil', 'Data prestasi baru Anda berhasil disimpan.', 'success');
      toggleElement('prestasi-add-box');
      loadPrestasiData();
    } else {
      showAlert('Gagal Menyimpan', 'Terjadi kendala saat merekam ke database.', 'error');
    }
  });
}

function loadKonselingData() {
  const list = document.getElementById('konseling-list-container');
  if (!list) return;
  list.innerHTML = '<div class="shimmer h-16 rounded-xl w-full"></div>';

  callBackend('getData', { sheetName: 'PENDAMPINGAN' }).then(data => {
    const filtered = (data || []).filter(item => item.NISN.toString() === appState.user.nisn.toString());
    if (filtered.length === 0) {
      list.innerHTML = '<p class="text-center text-xs text-gray-400 py-6">Tidak ada catatan pendampingan.</p>';
      return;
    }
    list.innerHTML = filtered.map(item => `
      <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs">
        <div class="flex justify-between items-center mb-2 pb-1.5 border-b border-gray-50 text-[10px]">
          <span class="text-gray-400 font-bold">${item.Tanggal || ''}</span>
          <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">Guru: ${item.Guru || 'BK'}</span>
        </div>
        <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Permasalahan:</p>
        <p class="font-bold text-slate-800 mb-2">${item.Permasalahan || '-'}</p>
        <div class="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <p class="text-[9px] uppercase font-bold text-emerald-600 tracking-wide">Solusi / Tindak Lanjut:</p>
          <p class="text-gray-600 font-medium mt-0.5">${item.Solusi || '-'}</p>
        </div>
      </div>
    `).join('');
  });
}

function showAlert(title, msg, type = 'success') {
  const overlay = document.getElementById('custom-alert');
  const card = document.getElementById('alert-card');
  const icon = document.getElementById('alert-icon');
  
  if (!overlay || !card) return;
  
  document.getElementById('alert-title').innerText = title;
  document.getElementById('alert-msg').innerText = msg;
  
  if (type === 'success') {
    icon.innerHTML = '<i class="fas fa-circle-check"></i>';
    icon.className = "w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-2xl font-bold bg-emerald-50 text-emerald-500 animate-bounce";
  } else {
    icon.innerHTML = '<i class="fas fa-triangle-exclamation"></i>';
    icon.className = "w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-2xl font-bold bg-rose-50 text-rose-500 animate-bounce";
  }

  overlay.classList.remove('opacity-0', 'pointer-events-none');
  card.classList.remove('scale-75');
  card.classList.add('scale-100');
}

function closeAlert() {
  const overlay = document.getElementById('custom-alert');
  const card = document.getElementById('alert-card');
  if (overlay && card) {
    overlay.classList.add('opacity-0', 'pointer-events-none');
    card.classList.remove('scale-100');
    card.classList.add('scale-75');
  }
}

function toggleElement(id) {
  const target = document.getElementById(id);
  if (target) target.classList.toggle('hidden');
}
