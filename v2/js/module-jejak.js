// Inisialisasi awal saat halaman informasiSiswa dibuka
function initJejak() { 
    switchSubMenu('prestasi'); 
}

// Logika Switch Sub-Menu (Rekam Jejak)
function switchSubMenu(subName) {
    appState.currentSubMenu = subName;
    
    // Reset tombol aktif
    document.querySelectorAll('.sub-tab-item').forEach(btn => 
        btn.classList.remove('bg-smpprimary', 'text-white', 'active')
    );
    
    const activeSubBtn = document.getElementById(`subbtn-${subName}`);
    if (activeSubBtn) activeSubBtn.classList.add('bg-smpprimary', 'text-white', 'active');

    const subContainer = document.getElementById('sub-menu-content-container');
    if (!subContainer) return;

    subContainer.innerHTML = '<div class="shimmer h-20 rounded-xl w-full"></div>';

    // Panggil fungsi sesuai kategori
    if (subName === 'prestasi') loadDataPrestasiMenu3(subContainer);
    if (subName === 'informasi') loadDataInformasiMenu3(subContainer);
    if (subName === 'pelanggaran') loadDataPelanggaranMenu3(subContainer);
    if (subName === 'jadwal') loadDataJadwalMenu3(subContainer);
}

// 🏆 PEMUAT DATA PRESTASI
function loadDataPrestasiMenu3(container) {
    callBackend('getData', { sheetName: 'PRESTASI' }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada log prestasi.</p>'; return; }
        container.innerHTML = data.map(item => `
            <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs mb-3">
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

// 📢 PEMUAT DATA PENGUMUMAN
function loadDataInformasiMenu3(container) {
    callBackend('getData', { sheetName: 'INFORMASI' }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada pengumuman kelas.</p>'; return; }
        container.innerHTML = data.map(item => `
            <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs mb-3">
                <b class="text-slate-800 text-sm block">${item.Judul || item.judul || ''}</b>
                <p class="text-gray-500 mt-1 leading-relaxed">${item.Isi || item.isi || ''}</p>
            </div>
        `).join('');
    });
}

// 🚨 PEMUAT DATA PELANGGARAN
function loadDataPelanggaranMenu3(container) {
    callBackend('getData', { sheetName: 'PELANGGARAN' }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Catatan kelas bersih dari pelanggaran.</p>'; return; }
        container.innerHTML = data.map(item => `
            <div class="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-xs flex justify-between items-center mb-3">
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

// 📅 PEMUAT DATA JADWAL
function loadDataJadwalMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL' }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Belum ada agenda jadwal pelajaran.</p>'; return; }
        container.innerHTML = data.map(item => `
            <div class="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs flex justify-between mb-2">
                <span class="font-black text-smpprimary w-16 uppercase">${item.Hari || item.hari || '-'}</span>
                <div class="flex-1 pl-2 border-l border-gray-100">
                    <b class="text-slate-800">${item.Pelajaran || item.pelajaran || '-'}</b>
                    <p class="text-gray-400 text-[10px]">${item.Jam || item.jam || ''} | Guru: ${item.Guru || item.guru || '-'}</p>
                </div>
            </div>
        `).join('');
    });
}
