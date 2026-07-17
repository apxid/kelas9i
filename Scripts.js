// Scripts.js - Final Full Revision
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let chartInstance = null;
let masterSidata = [];

window.addEventListener('DOMContentLoaded', () => { switchView('dashboard'); });

// 1. ROUTER & NAVIGASI
function switchView(viewName) {
    appState.currentView = viewName;
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`button[onclick="switchView('${viewName}')"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const screenContainer = document.getElementById('active-view');
    screenContainer.innerHTML = '<div class="p-10 text-center text-gray-500 animate-pulse">Memuat...</div>';

    fetch(`${viewName}.html`)
        .then(r => r.text()).then(html => {
            screenContainer.innerHTML = html;
            if (viewName === 'dashboard') { loadInfoKelasBeranda(); loadGrafikSiswa(); }
            if (viewName === 'informasiSiswa') switchSubMenu(appState.currentSubMenu);
        }).catch(e => { screenContainer.innerHTML = 'Gagal memuat.'; });
}

// 2. SUB-MENU & DATA RENDERER
function switchSubMenu(subName) {
    appState.currentSubMenu = subName;
    document.querySelectorAll('.sub-tab-item').forEach(btn => btn.classList.remove('bg-smpprimary', 'text-white', 'active'));
    const btn = document.getElementById(`subbtn-${subName}`);
    if (btn) btn.classList.add('bg-smpprimary', 'text-white', 'active');

    const container = document.getElementById('sub-menu-content-container');
    container.innerHTML = '<div class="h-20 animate-pulse bg-gray-100 rounded-xl"></div>';

    if (subName === 'prestasi') loadDataPrestasiMenu3(container);
    else if (subName === 'informasi') loadDataInformasiMenu3(container);
    else if (subName === 'pelanggaran') loadDataPelanggaranMenu3(container);
    else if (subName === 'jadwal') loadDataJadwalMenu3(container);
    else if (subName === 'jadwal-piket') loadDataPiketMenu3(container);
}

// 3. LOGIKA DATA PENGUMUMAN & PELANGGARAN
function loadDataInformasiMenu3(c) {
    callBackend('getData', { sheetName: 'INFORMASI' }).then(d => {
        c.innerHTML = d.map(i => `<div class="p-4 bg-white border rounded-2xl shadow-sm mb-3">
            <h4 class="font-bold text-slate-800">${i.Judul || i.judul || 'Tanpa Judul'}</h4>
            <p class="text-xs text-gray-600 mt-1 leading-relaxed">${i.Isi || i.isi || '-'}</p>
        </div>`).join('');
    });
}

function loadDataPelanggaranMenu3(c) {
    callBackend('getData', { sheetName: 'PELANGGARAN' }).then(d => {
        c.innerHTML = d.map(i => `<div class="p-4 bg-white border rounded-2xl shadow-sm mb-3 flex justify-between items-center">
            <div><p class="font-bold text-slate-800 text-xs">NISN: ${i.NISN || i.nisn || '-'}</p>
            <p class="text-[10px] text-gray-500">${i.Keterangan || i.keterangan || '-'}</p></div>
            <span class="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold">${i.Poin || i.poin || 0} Poin</span>
        </div>`).join('');
    });
}

// 4. LOGIKA JADWAL & PIKET (Fixed)
function loadDataPiketMenu3(c) {
    callBackend('getData', { sheetName: 'JADWAL_PIKET' }).then(d => {
        c.innerHTML = `<div class="bg-white border rounded-2xl overflow-hidden">${d.map(i => `
            <div class="flex justify-between p-4 border-b text-xs">
                <span class="font-bold text-smpprimary">${i.Hari || i.hari || '-'}</span>
                <span class="text-slate-700">${i['Nama Siswa'] || i.nama_siswa || i.Nama || '-'}</span>
            </div>`).join('')}</div>`;
    });
}

function loadDataJadwalMenu3(c) {
    callBackend('getData', { sheetName: 'JADWAL' }).then(d => {
        c.innerHTML = d.map(i => `<div class="p-4 bg-white border rounded-xl shadow-sm mb-2 text-xs">
            <div class="flex justify-between font-bold text-slate-800 mb-1"><span>${i.Pelajaran || i.pelajaran || '-'}</span><span>${i.Jam || i.jam || ''}</span></div>
            <div class="text-[10px] text-gray-400">Guru: ${i.Guru || i.guru || '-'}</div>
        </div>`).join('');
    });
}

// 5. DASHBOARD & GRAFIK (Fixed)
function loadInfoKelasBeranda() {
    callBackend('getData', { sheetName: 'INFO_KELAS' }).then(d => {
        d.forEach(i => {
            const el = document.getElementById(`val-${i.KOMPONEN.replace(/\s/g, '_')}`);
            if (el) el.innerText = i.VALUE;
        });
    });
}

function loadGrafikSiswa() {
    callBackend('getData', { sheetName: 'BIODATA' }).then(d => {
        const L = d.filter(s => (s['Jenis Kelamin']||'').toLowerCase().includes('l')).length;
        const P = d.filter(s => (s['Jenis Kelamin']||'').toLowerCase().includes('p')).length;
        const canvas = document.getElementById('chartJenisKelamin');
        if (canvas && window.Chart) {
            if (chartInstance) chartInstance.destroy();
            chartInstance = new Chart(canvas, {
                type: 'doughnut',
                data: { labels: ['L', 'P'], datasets: [{ data: [L, P], backgroundColor: ['#0B409C', '#F4CE14'] }] }
            });
        }
    });
}

// 6. BACKEND HELPER
async function callBackend(a, p = {}) {
    try {
        let url = `${BACKEND_URL}?action=${a}`;
        if (a === 'getData') url += `&sheetName=${p.sheetName}`;
        return await (await fetch(url)).json();
    } catch (e) { return []; }
}
