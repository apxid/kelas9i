(function() {
    // 1. Injeksi CSS Khusus Menu Setengah Lingkaran (Radial Menu)
    const style = document.createElement('style');
    style.innerHTML = `
        .launcher-container, .launcher-container * {
            box-sizing: border-box !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        /* Container Melayang di Kanan Bawah (Di atas posisi gambar panda) */
        .launcher-container {
            position: fixed !important;
            bottom: 80px !important; 
            right: 20px !important;
            z-index: 999999 !important;
        }

        /* Tombol Utama Toggle */
        .launcher-toggle {
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            background: #075E54 !important;
            border: none !important;
            color: white !important;
            cursor: pointer !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            z-index: 2 !important;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            outline: none !important;
        }

        .launcher-toggle:hover {
            transform: scale(1.08) !important;
        }

        .launcher-toggle svg {
            width: 26px !important;
            height: 26px !important;
            stroke: currentColor !important;
            stroke-width: 2 !important;
            stroke-linecap: round !important;
            stroke-linejoin: round !important;
            fill: none !important;
            transition: transform 0.3s ease, opacity 0.3s ease !important;
        }

        .launcher-toggle .icon-close {
            position: absolute !important;
            opacity: 0 !important;
            transform: rotate(-90deg) scale(0.5) !important;
        }

        /* State Saat Menu Terbuka */
        .launcher-container.active .launcher-toggle {
            background: #dc2626 !important;
        }

        .launcher-container.active .launcher-toggle .icon-open {
            opacity: 0 !important;
            transform: rotate(90deg) scale(0.5) !important;
        }

        .launcher-container.active .launcher-toggle .icon-close {
            opacity: 1 !important;
            transform: rotate(0deg) scale(1) !important;
        }

        /* Container Item Menu */
        .launcher-menu {
            position: absolute !important;
            bottom: 0 !important;
            right: 0 !important;
            width: 60px !important;
            height: 60px !important;
            z-index: 1 !important;
            pointer-events: none !important;
        }

        /* Item Shortcut Melingkar */
        .launcher-item {
            position: absolute !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            background: #ffffff !important;
            color: #1e293b !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.18) !important;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            opacity: 0 !important;
            transform: translate(0, 0) scale(0.3) !important;
            font-size: 20px !important;
            border: 1px solid rgba(0,0,0,0.05) !important;
        }

        .launcher-item:hover {
            background: #dcf8c6 !important;
            transform: scale(1.15) !important;
        }

        /* Label Tooltip Saat Hover Item */
        .launcher-item::after {
            content: attr(data-title) !important;
            position: absolute !important;
            right: 56px !important;
            background: rgba(15, 23, 42, 0.85) !important;
            color: white !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.2s ease !important;
            font-weight: 500 !important;
        }

        .launcher-item:hover::after {
            opacity: 1 !important;
        }

        /* Aktifkan Event Klik & Posisi Setengah Lingkaran Saat Buka */
        .launcher-container.active .launcher-item {
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Daftar Shortcut External Link
    const menuData = [
        { title: "Launcher", url: "https://apxid.github.io/kelas9i/launcher.html", icon: "🚀" },
        { title: "Materi Kelas", url: "https://google.com", icon: "📚" },
        { title: "Tugas", url: "https://classroom.google.com", icon: "📝" },
        { title: "Website", url: "https://apxid.github.io/kelas9i/", icon: "🌐" }
    ];

    // 3. Render Elemen DOM
    const initWidget = () => {
        if (document.getElementById('launcherContainer')) return;

        const container = document.createElement('div');
        container.className = 'launcher-container';
        container.id = 'launcherContainer';

        container.innerHTML = `
            <div class="launcher-menu" id="launcherMenu"></div>
            <button class="launcher-toggle" id="launcherToggle" aria-label="Buka Menu">
              <svg class="icon-open" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
              </svg>
              <svg class="icon-close" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
        `;

        document.body.appendChild(container);

        // Render Item Menu & Hitung Matematika Posisi Setengah Lingkaran (Arc 90°-180°)
        const menuEl = document.getElementById('launcherMenu');
        const radius = 100; // Jarak jangkauan busur setengah lingkaran (piksel)
        const totalItems = menuData.length;

        menuData.forEach((item, index) => {
            const a = document.createElement('a');
            a.className = 'launcher-item';
            a.href = item.url;
            a.target = '_blank';
            a.setAttribute('data-title', item.title);
            a.innerHTML = item.icon;

            // Hitung Sudut Menyebar Menyudut ke Kiri-Atas (Sudut 90 Derajat Sampai 180 Derajat)
            const angle = 90 + (index * (90 / (totalItems - 1 || 1)));
            const rad = angle * (Math.PI / 180);

            const x = Math.round(radius * Math.cos(rad));
            const y = Math.round(-radius * Math.sin(rad));

            // Simpan Koordinat Posisi Akhir Item
            a.dataset.x = x;
            a.dataset.y = y;

            menuEl.appendChild(a);
        });

        // Event Listener Toggle
        const toggleBtn = document.getElementById('launcherToggle');
        toggleBtn.addEventListener('click', () => {
            container.classList.toggle('active');
            const items = menuEl.querySelectorAll('.launcher-item');

            items.forEach((item) => {
                if (container.classList.contains('active')) {
                    item.style.transform = `translate(${item.dataset.x}px, ${item.dataset.y}px) scale(1)`;
                } else {
                    item.style.transform = `translate(0, 0) scale(0.3)`;
                }
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
