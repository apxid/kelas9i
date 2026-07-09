// TemplateViews.js - Menyimpan layout komponen SPA
const TEMPLATE_VIEWS = {
  login: `
    <div class="px-6 flex flex-col justify-center min-h-[720px] fade-in">
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-smpprimary text-osisyellow rounded-[24px] mx-auto flex items-center justify-center text-3xl shadow-xl shadow-smpprimary/20 mb-4 border-2 border-white">
          <i class="fas fa-graduation-cap"></i>
        </div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight">SIAKAD MOBILE</h2>
        <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">SMP Negeri Portal Digital</p>
      </div>
      <div class="bg-white rounded-3xl p-6 shadow-xl border border-gray-100/80">
        <div class="mb-4">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">NISN / Akun Siswa</label>
          <input type="text" id="login-nisn" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Masukkan NISN Anda">
        </div>
        <div class="mb-6">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Kata Sandi</label>
          <input type="password" id="login-pwd" class="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="••••••••">
        </div>
        <button onclick="handleLogin()" class="w-full py-4 bg-smpprimary text-white font-bold rounded-xl shadow-lg hover:bg-blue-800 text-sm tracking-wide">
          MASUK SISTEM <i class="fas fa-arrow-right ml-2 text-xs"></i>
        </button>
      </div>
    </div>`,

  dashboard: `
    <div class="p-5 fade-in">
      <div class="bg-smpprimary rounded-3xl p-5 text-white shadow-xl relative overflow-hidden mb-6">
        <p class="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Selamat Datang,</p>
        <h3 class="text-xl font-black tracking-tight mt-0.5" id="dash-username">Memuat...</h3>
        <span class="inline-flex items-center bg-osisyellow text-smpprimary text-[10px] font-extrabold px-3 py-1 rounded-full mt-3 uppercase tracking-wider">Akun Aktif</span>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p class="text-[10px] font-bold text-gray-400 uppercase">Total Prestasi</p>
          <p class="text-xl font-black text-slate-800" id="count-prestasi">0</p>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p class="text-[10px] font-bold text-gray-400 uppercase">Poin Pelanggaran</p>
          <p class="text-xl font-black text-slate-800" id="count-pelanggaran">0</p>
        </div>
      </div>
      <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Papan Informasi</h4>
      <div id="info-feed-container" class="space-y-3"></div>
    </div>`,

  biodata: `
    <div class="p-5 fade-in">
      <h4 class="text-base font-extrabold text-slate-800 mb-6">Profil & Biodata</h4>
      <div class="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div class="border-b border-gray-100 pb-3">
          <p class="text-[10px] text-gray-400 font-bold uppercase">Nama Lengkap</p>
          <p class="text-sm font-bold text-slate-800" id="bio-nama">Memuat...</p>
        </div>
        <div class="grid grid-cols-2 gap-4 border-b border-gray-50 pb-3">
          <div><p class="text-[10px] text-gray-400 font-bold">NISN</p><p class="text-xs font-bold text-slate-800" id="bio-nisn">-</p></div>
          <div><p class="text-[10px] text-gray-400 font-bold">Kelas</p><p class="text-xs font-bold text-slate-800" id="bio-kelas">-</p></div>
        </div>
        <div class="border-b border-gray-50 pb-3">
          <p class="text-[10px] text-gray-400 font-bold">Alamat Lengkap</p>
          <p class="text-xs text-slate-600" id="bio-alamat">-</p>
        </div>
      </div>
    </div>`,

  prestasi: `
    <div class="p-5 fade-in">
      <div class="flex justify-between items-center mb-6">
        <h4 class="text-base font-extrabold text-slate-800">Prestasi Siswa</h4>
        <button onclick="toggleElement('prestasi-add-box')" class="bg-smpprimary text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md"><i class="fas fa-plus mr-1"></i> Tambah</button>
      </div>
      <div id="prestasi-add-box" class="hidden bg-white p-4 rounded-2xl border border-gray-200 mb-4">
        <input type="text" id="pres-form-nama" class="w-full p-2 bg-gray-50 border rounded-lg text-xs mb-2" placeholder="Nama Lomba/Prestasi">
        <div class="flex justify-end space-x-2"><button onclick="submitPrestasi()" class="bg-smpprimary text-white px-3 py-1.5 rounded-lg text-xs font-bold">Simpan</button></div>
      </div>
      <div id="prestasi-list-container" class="space-y-3"></div>
    </div>`,

  konseling: `
    <div class="p-5 fade-in">
      <h4 class="text-base font-extrabold text-slate-800 mb-5">Log Pendampingan BK</h4>
      <div id="konseling-list-container" class="space-y-3"></div>
    </div>`
};
