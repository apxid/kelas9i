// Scripts.js - Master Router & Global Helpers

// 1. STATE & GLOBAL VARIABLES
let appState = { currentView: 'dashboard', currentSubMenu: 'prestasi' };
let masterSidata = [];
let isPinVerified = false;

// 2. ROUTER UTAMA (Sistem Navigasi Modul)
function switchView(viewName) {
    const container = document.getElementById('active-view');
    
    // Tampilan Loading
    container.innerHTML = '<div class="p-10 text-center text-gray-400">Memuat...</div>';

    fetch(`${viewName}.html`)
        .then(r => r.text())
        .then(html => {
            container.innerHTML = html;
            
            // Hapus script modul sebelumnya agar tidak bentrok
            const oldScript = document.getElementById('dynamic-script');
            if (oldScript) oldScript.remove();

            // Load modul JS spesifik secara dinamis
            const script = document.createElement('script');
            script.src = `js/module-${viewName}.js`;
            script.id = 'dynamic-script';
            document.body.appendChild(script);
        })
        .catch(err => {
            container.innerHTML = `<p class="p-6 text-center text-rose-500">Gagal memuat: ${err.message}</p>`;
        });
}

// 3. GLOBAL BACKEND HANDLER (Digunakan oleh semua modul)
async function callBackend(action, params = {}) {
    try {
        let url = `${BACKEND_URL}?action=${action}`;
        if (params.sheetName) url += `&sheetName=${params.sheetName}`;
        const r = await fetch(url);
        return await r.json();
    } catch (e) {
        console.error("Backend Error:", e);
        return [];
    }
}

// 4. GLOBAL UI HELPERS
function showAlert(title, msg) {
    const overlay = document.getElementById('custom-alert');
    if (overlay) {
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-msg').innerText = msg;
        overlay.classList.remove('opacity-0', 'pointer-events-none');
    }
}

function closeAlert() {
    const overlay = document.getElementById('custom-alert');
    if (overlay) overlay.classList.add('opacity-0', 'pointer-events-none');
}

// 5. INITIALIZATION
window.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});
