(function() {
    // 1. Injeksi CSS Khusus Edge Handle & Panel Efek Glassmorphism (Transparan)
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-widget-wrapper, #launcher-widget-wrapper * { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
            box-sizing: border-box !important;
        }

        /* Handle Garis Transparan Putih (Gaya Samsung Edge Panel) */
        #launcher-icon { 
            position: absolute !important; 
            top: 50% !important; 
            right: 0 !important; 
            transform: translateY(-50%) !important;
            cursor: pointer !important; 
            z-index: 999999 !important; 
            width: 6px !important;
            height: 70px !important;
            background: rgba(255, 255, 255, 0.35) !important;
            backdrop-filter: blur(6px) !important;
            -webkit-backdrop-filter: blur(6px) !important;
            border-radius: 6px 0 0 6px !important;
            box-shadow: -2px 0 8px rgba(0,0,0,0.1) !important;
            user-select: none !important;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        #launcher-icon:hover {
            width: 10px !important;
            background: rgba(255, 255, 255, 0.6) !important;
        }

        /* Animasi Tekan Klik Handle */
        #launcher-icon.clicked {
            transform: translateY(-50%) scale(0.9) !important;
        }

        /* Container Pembungkus Panel Vertikal dengan Efek Kaca (Glassmorphism) */
        #launcher-radial-menu {
            position: absolute !important;
            top: 50% !important;
            right: -80px !important; /* Disembunyikan di luar batas aplikasi saat tertutup */
            transform: translateY(-50%) !important;
            width: 65px !important;
            z-index: 999998 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            padding: 15px 8px !important;
            background: rgba(255, 255, 255, 0.2) !important; /* Transparan efek kaca */
            backdrop-filter: blur(20px) !important; /* Efek blur kaca buram ala One UI */
            -webkit-backdrop-filter: blur(20px) !important;
            border-radius: 22px 0 0 22px !important;
            box-shadow: -8px 8px 32px 0 rgba(31, 38, 135, 0.15) !important; /* Bayangan lembut khas glass */
            border: 1px solid rgba(255, 255, 255, 0.4) !important; /* Garis tepi tipis bersinar */
            border-right: none !important;
            transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Item Tombol Panel Vertikal dengan Efek Kaca Semi-Transparan */
        .radial-item {
            position: relative !important;
            width: 48px !important;
            height: 48px !important;
            border-radius: 14px !important;
            background: rgba(255, 255, 255, 0.35) !important; /* Tombol ikut transparan kaca */
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            color: #1e293b !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important;
            transition: transform 0.2s ease, background 0.2s ease, border 0.2s ease !important;
            font-size: 20px !important;
            border: 1px solid rgba(255, 255, 255, 0.6) !important;
        }

        .radial-item:hover {
            background: rgba(255, 255, 255, 0.65) !important;
            transform: scale(1.08) !important;
            border: 1px solid rgba(255, 255, 255, 0.9) !important;
        }

        /* Tooltip Label Nama Menu Saat Hover */
        .radial-item::after {
            content: attr(data-title) !important;
            position: absolute !important;
            right: 60px !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            background: rgba(15, 23, 42, 0.8) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            color: white !important;
            padding: 5px 10px !important;
            border-radius: 8px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            opacity: 0 !important;
            pointer-events: none !important;
            transition: opacity 0.2s ease !important;
            font-weight: 600 !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        .radial-item:hover::after {
            opacity: 1 !important;
        }

        /* Status Aktif saat Edge Panel Terbuka */
        #launcher-widget-wrapper.active #launcher-radial-menu {
            right: 15px !important; /* Muncul menggeser ke dalam area aplikasi */
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        /* Menggeser Handle saat panel terbuka */
        #launcher-widget-wrapper.active #launcher-icon {
            right: 85px !important;
            border-radius: 6px !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Data Link Eksternal
    const menuData = [
        { title: "KAS", url: "https://apxid.github.io/kelas9i/kas", icon: "🚀" },
        { title: "Home", url: "https://apxid.github.io/kelas9i/", icon: "📚" },
        { title: "LMS Informatika", url: "https://tik-spensamo.blogspot.com/", icon: "📝" }
    ];

    // 3. Injeksi Elemen HTML ke Kontainer Aplikasi
    const initWidget = () => {
        if (document.getElementById('launcher-widget-wrapper')) return;

        const appContainer = document.querySelector('.w-full.max-w-md') || document.querySelector('main') || document.body;
        if (appContainer !== document.body) {
            appContainer.style.position = 'relative';
            appContainer.style.overflow = 'hidden';
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'launcher-widget-wrapper';
        wrapper.innerHTML = `
            <audio id="sound-open" src="https://www.soundjay.com/buttons/sounds/button-10.mp3" preload="auto"></audio>
            <audio id="sound-close" src="https://www.soundjay.com/buttons/sounds/button-16.mp3" preload="auto"></audio>

            <!-- Container Edge Panel Vertikal (Efek Glass) -->
            <div id="launcher-radial-menu"></div>

            <!-- Handle Garis Transparan Putih di Sisi Kanan Aplikasi -->
            <div id="launcher-icon" onclick="toggleLauncherMenu()"></div>
        `;
        appContainer.appendChild(wrapper);

        // Render Item Menu Vertikal ke dalam Panel
        const menuContainer = document.getElementById('launcher-radial-menu');

        menuData.forEach((item) => {
            const a = document.createElement('a');
            a.className = 'radial-item';
            a.href = item.url;
            a.target = '_blank';
            a.setAttribute('data-title', item.title);
            a.innerHTML = item.icon;
            menuContainer.appendChild(a);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // 4. Logika Buka/Tutup Edge Panel
    window.toggleLauncherMenu = function() {
        const wrapper = document.getElementById('launcher-widget-wrapper');
        const icon = document.getElementById('launcher-icon');
        const soundOpen = document.getElementById('sound-open');
        const soundClose = document.getElementById('sound-close');

        if (!wrapper || !icon) return;

        icon.classList.add('clicked');
        setTimeout(() => icon.classList.remove('clicked'), 200);

        const isActive = wrapper.classList.toggle('active');

        if (isActive) {
            if (soundOpen) soundOpen.play().catch(() => {});
        } else {
            if (soundClose) soundClose.play().catch(() => {});
        }
    };
})();
