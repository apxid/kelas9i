// Scripts.js - Multi-file Router Engine
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];
let currentSiswaIndex = -1;
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => { switchView('dashboard'); });

// 1. ROUTER & NAVIGASI
function switchView(viewName) {
    appState.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const screenContainer = document.getElementById('active-view');
    screenContainer.innerHTML = '<div class="p-6 flex flex-col items-center justify-center min-h-[400px]"><div class="w-10 h-10 border-4 border-smpprimary border-t-transparent rounded-full animate-spin"></div></div>';

    fetch(`${viewName}.html`)
        .then(r => { if (!r.ok) throw new Error('Gagal memuat'); return r.text(); })
        .then(html => {
            screenContainer.innerHTML = html;
            if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
            if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
            if (viewName === 'profilSiswa') checkPinAksesProfil();
        })
        .catch(err => { screenContainer.innerHTML = `<p class="p-6 text-center text-xs text-rose-500">Error: ${err.message}</p>`; });
}

// 2. SUB-MENU & SCROLLING
function scrollMenu(direction) {
    const container = document.getElementById('scroll-container');
    if (container) container.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
}

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

// 3. PEMUAT DATA REKAM JEJAK
function loadDataPiketMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Data kosong.</p>'; return; }
        container.innerHTML = `<div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"><div class="p-4 bg-gray-50 border-b border-gray-100 font-bold text-xs">Jadwal Piket</div>${data.map(item => `<div class="flex justify-between px-4 py-3 border-b text-xs"><span class="font-bold text-smpprimary w-20">${item.Hari || item.hari || '-'}</span><span class="text-slate-600 flex-1 text-right">${item['Nama Siswa'] || item.nama_siswa || item.Nama || '-'}</span></div>`).join('')}</div>`;
    });
}

function loadDataJadwalMenu3(container) {
    callBackend('getData', { sheetName: 'JADWAL' }).then(data => {
        if (!data || data.length === 0) { container.innerHTML = '<p class="text-center text-xs text-gray-400 py-4">Jadwal kosong.</p>'; return; }
        container.innerHTML = data.map(item => `
            <div class="p-3 bg-white border border-gray-100 rounded-xl shadow-sm text-xs mb-2">
                <div class="flex justify-between font-bold text-smpprimary uppercase mb-1"><span>${item.Hari || '-'}</span><span>${item.Jam || '-'}</span></div>
                <div class="border-t pt-1"><b class="text-slate-800">${item.Pelajaran || '-'}</b><p class="text-gray-400">Guru: ${item.Guru || '-'}</p></div>
            </div>`).join('');
    });
}

// 4. FUNGSI PENDUKUNG LAINNYA
function loadInfoKelasBeranda() {
    callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
        data.forEach(item => {
            const key = item.KOMPONEN ? item.KOMPONEN.replace(/\s+/g, '_') : '';
            const valContainer = document.getElementById(`val-${key}`);
            const wrapper = document.getElementById(`wrapper-${key}`);
            if (wrapper) wrapper.classList.remove('hidden');
            if (valContainer) valContainer.innerText = item.VALUE || '-';
        });
    });
}

// Fungsi dummy untuk menjaga sisa fungsi tetap ada di file Anda
function loadDataPrestasiMenu3(c) { callBackend('getData', { sheetName: 'PRESTASI' }).then(d => c.innerHTML = d.map(i => `<div class="p-4 bg-white border rounded-2xl text-xs mb-2"><b>${i['Nama Prestasi'] || '-'}</b></div>`).join('')); }
function loadDataInformasiMenu3(c) { callBackend('getData', { sheetName: 'INFORMASI' }).then(d => c.innerHTML = d.map(i => `<div class="p-4 bg-white border rounded-2xl text-xs mb-2"><b>${i.Judul || '-'}</b></div>`).join('')); }
function loadDataPelanggaranMenu3(c) { callBackend('getData', { sheetName: 'PELANGGARAN' }).then(d => c.innerHTML = d.map(i => `<div class="p-4 bg-white border rounded-2xl text-xs mb-2">${i.NISN} - ${i.Poin} Poin</div>`).join('')); }
function loadGrafikSiswa() { /* Logic Chart Anda */ }
function checkPinAksesProfil() { /* Logic PIN Anda */ }
function verifikasiPinProfil() { /* Logic PIN Anda */ }
function loadDropdownDaftarSiswa() { /* Logic Profil Anda */ }
function renderDetailProfilSiswa(n) { /* Logic Profil Anda */ }

async function callBackend(a, p = {}) {
    try {
        let url = `${BACKEND_URL}?action=${a}`;
        if (a === 'getData') url += `&sheetName=${p.sheetName}`;
        return await (await fetch(url)).json();
    } catch (e) { console.error(e); return []; }
}
