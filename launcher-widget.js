(function() {
    // 1. Injeksi CSS Khusus Launcher & Menu Setengah Lingkaran
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-widget-wrapper, #launcher-widget-wrapper * { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
            box-sizing: border-box !important;
        }

        /* Ikon Roket Floating (Ukuran diperkecil) */
        #launcher-icon { 
            position: absolute !important; 
            bottom: 135px !important; /* Presisi di atas posisi panda */
            right: 22px !important; 
            cursor: pointer !important; 
            z-index: 999998 !important; 
            background: transparent !important;
            user-select: none !important;
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        #launcher-icon img { 
            width: 42px !important; /* Ukuran diperkecil */
            height: auto !important; 
            display: block !important;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)) !important;
            transition: transform 0.2s ease !important;
        }

        #launcher-icon:hover img { 
            transform: scale(1.1) rotate(-5deg) !important; 
        }

        /* Animasi saat ikon diklik (Click Feedback) */
        #launcher-icon.clicked {
            transform: scale(0.82) !important;
        }

        /* Container Menu Setengah Lingkaran */
        #launcher-radial-menu {
            position: absolute !important;
            bottom: 135px !important;
            right: 22px !important;
            width: 42px !important;
            height: 42px !important;
            z-index: 999997 !important;
            pointer-events: none !important;
        }

        /* Item Tombol Menu Setengah Lingkaran */
        .radial-item {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50% !important;
            background: #ffffff !important;
            color: #1e293b !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
            opacity: 0 !important;
            transform: translate(0, 0) scale(0.3) !important;
            font-size: 18px !important;
            border: 1px solid rgba(0,0,0,0.08) !important;
        }

        .radial-item:hover {
            background: #dcf8c6 !important;
            transform: scale(1.18) !important;
        }

        /* Tooltip Label Nama Menu Saat Hover */
        .radial-item::after {
            content: attr(data-title) !important;
            position: absolute !important;
            right: 48px !important;
            background: rgba(15, 23, 42, 0.85) !important;
            color: white !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            font-size: 11px !important;
            white-space: nowrap !important;
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.2s ease !important;
            font-weight: 600 !important;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2) !important;
        }

        .radial-item:hover::after {
            opacity: 1 !important;
        }

        /* Status Aktif Menu Terbuka */
        #launcher-widget-wrapper.active .radial-item {
            opacity: 1 !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Data Link Eksternal
    const menuData = [
        { title: "KAS", url: "https://apxid.github.io/kelas9i/kas", icon: "🚀" },
        { title: "Home", url: "https://apxid.github.io/kelas9i/", icon: "📚" },
        { title: "LMS Informatika", url: "https://tik-spensamo.blogspot.com/", icon: "📝" }
    ];

    // 3. Injeksi Elemen HTML ke Kontainer Aplikasi (.w-full.max-w-md)
    const initWidget = () => {
        if (document.getElementById('launcher-widget-wrapper')) return;

        const appContainer = document.querySelector('.w-full.max-w-md');
        if (!appContainer) return;

        appContainer.style.position = 'relative';

        const wrapper = document.createElement('div');
        wrapper.id = 'launcher-widget-wrapper';
        wrapper.innerHTML = `
            <audio id="sound-open" src="https://www.soundjay.com/buttons/sounds/button-10.mp3" preload="auto"></audio>
            <audio id="sound-close" src="https://www.soundjay.com/buttons/sounds/button-16.mp3" preload="auto"></audio>

            <!-- Menu Setengah Lingkaran -->
            <div id="launcher-radial-menu"></div>

            <!-- Ikon Roket Launcher -->
            <div id="launcher-icon" onclick="toggleLauncherMenu()">
                <img src="https://apxid.github.io/kelas9i/assets/launcher.png" alt="Launcher Icon"/>
            </div>
        `;
        appContainer.appendChild(wrapper);

        // Build Item Menu Setengah Lingkaran
        const menuContainer = document.getElementById('launcher-radial-menu');
        const radius = 85; // Jarak sebaran menu
        const totalItems = menuData.length;

        menuData.forEach((item, index) => {
            const a = document.createElement('a');
            a.className = 'radial-item';
            a.href = item.url;
            a.target = '_blank';
            a.setAttribute('data-title', item.title);
            a.innerHTML = item.icon;

            // Hitung sudut menyebar setengah lingkaran (90 deg s/d 180 deg)
            const angle = 90 + (index * (90 / (totalItems - 1 || 1)));
            const rad = angle * (Math.PI / 180);

            const x = Math.round(radius * Math.cos(rad));
            const y = Math.round(-radius * Math.sin(rad));

            a.dataset.x = x;
            a.dataset.y = y;

            menuContainer.appendChild(a);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // 4. Logika Animasi Klik & Buka/Tutup Menu Setengah Lingkaran
    window.toggleLauncherMenu = function() {
        const wrapper = document.getElementById('launcher-widget-wrapper');
        const icon = document.getElementById('launcher-icon');
        const items = document.querySelectorAll('.radial-item');
        const soundOpen = document.getElementById('sound-open');
        const soundClose = document.getElementById('sound-close');

        if (!wrapper || !icon) return;

        // Efek animasi tekan pada ikon
        icon.classList.add('clicked');
        setTimeout(() => icon.classList.remove('clicked'), 200);

        // Toggle state aktif
        const isActive = wrapper.classList.toggle('active');

        if (isActive) {
            if (soundOpen) soundOpen.play().catch(() => {});
            items.forEach((item) => {
                item.style.transform = `translate(${item.dataset.x}px, ${item.dataset.y}px) scale(1)`;
            });
        } else {
            if (soundClose) soundClose.play().catch(() => {});
            items.forEach((item) => {
                item.style.transform = `translate(0, 0) scale(0.3)`;
            });
        }
    };
})();
