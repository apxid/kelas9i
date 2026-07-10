// Inisialisasi awal saat halaman Dashboard dibuka
function initDashboard() {
    loadInfoKelasBeranda(); 
    // Menambahkan pengecekan agar tidak error jika library Chart belum termuat
    if (typeof Chart !== 'undefined') {
        loadGrafikSiswa();
    }
}

// 🏫 PEMUAT INFO KELAS BERANDA
function loadInfoKelasBeranda() {
    callBackend('getData', { sheetName: 'INFO_KELAS' }).then(data => {
        if (!data) return;
        data.forEach(item => {
            const elementId = item.KOMPONEN.replace(/\s+/g, '_');
            const wrapper = document.getElementById(`wrapper-${elementId}`);
            const valContainer = document.getElementById(`val-${elementId}`);
            
            if (wrapper && item.STATUS === 'ACTIVE') {
                wrapper.classList.remove('hidden');
                if (valContainer) {
                    if (item.KOMPONEN === 'LOGO') { 
                        const logoEl = document.getElementById('val-LOGO');
                        if (logoEl) logoEl.src = item.VALUE; 
                    } else { 
                        valContainer.innerText = item.VALUE; 
                    }
                }
            }
        });
    });
}

// 📊 PEMUAT GRAFIK SISWA
function loadGrafikSiswa() {
    callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
        let L = 0, P = 0;
        (data || []).forEach(s => {
            const jkField = s['Jenis Kelamin'] || s['jenis_kelamin'] || s['JK'] || '';
            const jk = jkField.toString().toLowerCase().trim();
            if (jk === 'laki-laki' || jk === 'l' || jk === 'laki laki') L++;
            else if (jk === 'perempuan' || jk === 'p') P++;
        });
        
        const ctx = document.getElementById('chartJenisKelamin');
        if (!ctx) return;
        
        // Menghancurkan instance lama jika ada, untuk menghindari error saat re-render
        if (window.chartInstance) window.chartInstance.destroy();
        
        window.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: { 
                labels: ['Laki-laki', 'Perempuan'], 
                datasets: [{ data: [L, P], backgroundColor: ['#0B409C', '#F4CE14'], borderWidth: 2 }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } } } 
            }
        });
    });
}
