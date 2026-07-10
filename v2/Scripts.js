// Scripts.js - Master Router
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let masterSidata = [];
let isPinVerified = false;

window.addEventListener('DOMContentLoaded', () => { switchView('dashboard'); });

function switchView(viewName) {
    appState.currentView = viewName;
    const container = document.getElementById('active-view');
    if (!container) return;
    
    container.innerHTML = '<div class="p-6 text-center">Memuat...</div>';
    
    fetch(`${viewName}.html`)
        .then(r => r.text())
        .then(html => {
            container.innerHTML = html;
            
            // Panggil inisialisasi modul terkait
            if (typeof window['init' + capitalize(viewName)] === 'function') {
                window['init' + capitalize(viewName)]();
            }
        });
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// Global Backend Handler
async function callBackend(action, params = {}) {
    try {
        let url = `${BACKEND_URL}?action=${action}`;
        if (params.sheetName) url += `&sheetName=${params.sheetName}`;
        const r = await fetch(url);
        return await r.json();
    } catch (e) { return []; }
}

function showAlert(t, m) {
    document.getElementById('alert-title').innerText = t;
    document.getElementById('alert-msg').innerText = m;
    document.getElementById('custom-alert').classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlert() {
    document.getElementById('custom-alert').classList.add('opacity-0', 'pointer-events-none');
}
