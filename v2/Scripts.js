// Scripts.js - Master Router & Global Helpers
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let masterSidata = [];
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => { switchView('dashboard'); });

// 1. ROUTER UTAMA
function switchView(viewName) {
    appState.currentView = viewName;
    const container = document.getElementById('active-view');
    if (!container) return;
    
    container.innerHTML = '<div class="p-10 text-center animate-pulse text-gray-500">Memuat...</div>';
    
    fetch(`${viewName}.html`)
        .then(r => {
            if (!r.ok) throw new Error('Halaman tidak ditemukan');
            return r.text();
        })
        .then(html => {
            container.innerHTML = html;
            
            // Panggil inisialisasi modul secara dinamis
            // Contoh: viewName 'kas' memanggil 'initKas()'
            const initFunctionName = 'init' + capitalize(viewName);
            if (typeof window[initFunctionName] === 'function') {
                window[initFunctionName]();
            }
        })
        .catch(err => {
            console.error("Router Error:", err);
            container.innerHTML = `<div class="p-6 text-center text-red-500">Gagal memuat halaman: ${viewName}</div>`;
        });
}

// Helper untuk mengubah huruf pertama menjadi kapital
function capitalize(s) { 
    return s.charAt(0).toUpperCase() + s.slice(1); 
}

// 2. GLOBAL BACKEND HANDLER
async function callBackend(action, params = {}) {
    try {
        let url = `${BACKEND_URL}?action=${action}`;
        if (params.sheetName) url += `&sheetName=${params.sheetName}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error('Network response was not ok');
        return await r.json();
    } catch (e) { 
        console.error("Backend Error:", e);
        return []; 
    }
}

// 3. UI HELPERS
function showAlert(t, m) {
    const alertBox = document.getElementById('custom-alert');
    if (alertBox) {
        document.getElementById('alert-title').innerText = t;
        document.getElementById('alert-msg').innerText = m;
        alertBox.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function closeAlert() {
    const alertBox = document.getElementById('custom-alert');
    if (alertBox) alertBox.classList.add('opacity-0', 'pointer-events-none');
}
