// Scripts.js (Router)
function switchView(viewName) {
    const container = document.getElementById('active-view');
    fetch(`${viewName}.html`)
        .then(r => r.text())
        .then(html => {
            container.innerHTML = html;
            
            // Hapus script lama agar tidak bentrok
            const oldScript = document.getElementById('dynamic-script');
            if (oldScript) oldScript.remove();

            // Panggil modul JS yang sesuai
            const script = document.createElement('script');
            script.src = `js/module-${viewName}.js`;
            script.id = 'dynamic-script';
            document.body.appendChild(script);
        });
}
