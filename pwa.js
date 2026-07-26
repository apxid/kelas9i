document.addEventListener("DOMContentLoaded", () => {
  // Mencegah duplikasi elemen jika skrip terpanggil berulang kali
  if (document.getElementById('app-main-container')) return;

  const appShellHTML = `
    <div id="app-main-container" class="w-full max-w-md h-[100vh] sm:h-[840px] bg-appbg shadow-2xl overflow-hidden relative flex flex-col border border-slate-800/50">
      
      <div id="screen-container" class="flex-1 overflow-y-auto bg-gray-50/50">
        <div id="active-view"></div>
      </div>

      <nav id="bottom-nav" class="bg-white/95 backdrop-blur-md border-t border-gray-200/80 px-1 py-2.5 flex justify-around items-center z-40">
        <button onclick="switchView('dashboard')" class="nav-item flex flex-col items-center justify-center text-gray-400 py-1 flex-1 transition-all">
          <i class="fas fa-school text-base mb-0.5"></i>
          <span class="text-[8px] font-bold uppercase tracking-wider">Beranda</span>
        </button>
        <button onclick="switchView('formBiodata')" class="nav-item flex flex-col items-center justify-center text-gray-400 py-1 flex-1 transition-all">
          <i class="fas fa-clipboard-list text-base mb-0.5"></i>
          <span class="text-[8px] font-bold uppercase tracking-wider">Isi Data</span>
        </button>
        <button onclick="switchView('profilSiswa')" class="nav-item flex flex-col items-center justify-center text-gray-400 py-1 flex-1 transition-all">
          <i class="fas fa-id-card text-base mb-0.5"></i>
          <span class="text-[8px] font-bold uppercase tracking-wider">Profil</span>
        </button>
        <button onclick="switchView('informasiSiswa')" class="nav-item flex flex-col items-center justify-center text-gray-400 py-1 flex-1 transition-all">
          <i class="fas fa-folder-open text-base mb-0.5"></i>
          <span class="text-[8px] font-bold uppercase tracking-wider">Jejak</span>
        </button>
      </nav>

    </div>

    <div id="custom-alert" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300">
      <div class="bg-white p-5 w-full max-w-xs text-center shadow-2xl rounded-2xl">
        <h3 id="alert-title" class="text-sm font-black text-slate-800 mb-1"></h3>
        <p id="alert-msg" class="text-xs text-gray-500 mb-4 leading-relaxed"></p>
        <button onclick="closeAlert()" class="w-full py-2.5 bg-smpprimary text-white font-bold text-xs rounded-xl">Selesai</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('afterbegin', appShellHTML);

  if (typeof switchView === 'function') {
    switchView('dashboard');
  }
});

// Pendaftaran Service Worker untuk PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker PWA berhasil didaftarkan:', reg.scope))
      .catch((err) => console.log('Service Worker PWA gagal didaftarkan:', err));
  });
}
