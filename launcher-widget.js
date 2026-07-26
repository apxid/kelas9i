(function() {
    // 1. CSS Tampilan One UI Samsung Edge Panel
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-widget-wrapper, #launcher-widget-wrapper * { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; 
            box-sizing: border-box !important;
        }

        /* Handle Garis Samping Khas Samsung Edge Panel */
        #launcher-icon { 
            position: absolute !important; 
            top: 50% !important; 
            right: 0 !important; 
            transform: translateY(-50%) !important;
            cursor: pointer !important; 
            z-index: 999999 !important; 
            width: 6px !important;
            height: 80px !important;
            background: rgba(255, 255, 255, 0.45) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            border-radius: 6px 0 0 6px !important;
            box-shadow: -2px 0 8px rgba(0,0,0,0.2) !important;
            user-select: none !important;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        #launcher-icon:hover {
            width: 10px !important;
            background: rgba(255, 255, 255, 0.75) !important;
        }

        #launcher-icon.clicked {
            transform: translateY(-50%) scale(0.9) !important;
        }

        /* Container Panel Utama Samsung One UI (Gelap & Blur) */
        #launcher-radial-menu {
            position: absolute !important;
            top: 50% !important;
            right: -130px !important;
            transform: translateY(-50%) !important;
            width: 100px !important;
            z-index: 999998 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 18px 8px 14px 8px !important;
            background: rgba(28, 28, 30, 0.75) !important;
            backdrop-filter: blur(25px) saturation(180%) !important;
            -webkit-backdrop-filter: blur(25px) saturation(180%) !important;
            border-radius: 26px 0 0 26px !important;
            box-shadow: -8px 8px 30px rgba(0, 0, 0, 0.35) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-right: none !important;
            transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease !important;
            opacity: 0 !important;
            pointer-events: none !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
            scrollbar-width: none !important;
        }

        #launcher-radial-menu::-webkit-scrollbar {
            display: none;
        }

        /* Garis Pemisah Putus-Putus */
        .edge-divider {
            width: 80% !important;
            border-top: 1.5px dotted rgba(255, 255, 255, 0.3) !important;
            margin: 2px 0 !important;
        }

        /* Item Aplikasi (Squircle Icon + Label Teks) */
        .edge-item-wrapper {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-decoration: none !important;
            width: 100% !important;
            cursor: pointer !important;
            transition: transform 0.2s ease !important;
        }

        .edge-item-wrapper:hover {
            transform: scale(1.06) !important;
        }

        .edge-icon-box {
            width: 46px !important;
            height: 46px !important;
            border-radius: 15px !important;
            background: rgba(255, 255, 255, 0.12) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15) !important;
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            transition: background 0.2s ease !important;
        }

        .edge-item-wrapper:hover .edge-icon-box {
            background: rgba(255, 255, 255, 0.25) !important;
        }

        .edge-label {
            margin-top: 4px !important;
            color: #FFFFFF !important;
            font-size: 10px !important;
            font-weight: 400 !important;
            text-align: center !important;
            max-width: 80px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8) !important;
        }

        /* Footer Menu (Navigasi Bawah) */
        .edge-footer {
            display: flex !important;
            justify-content: space-around !important;
            width: 100% !important;
            padding-top: 6px !important;
            border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
        }

        .edge-footer-btn {
            background: transparent !important;
            border: none !important;
            color: rgba(255, 255, 255, 0.8) !important;
            font-size: 14px !important;
            cursor: pointer !important;
        }

        /* Status Aktif saat Edge Panel Terbuka */
        #launcher-widget-wrapper.active #launcher-radial-menu {
            right: 0 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        #launcher-widget-wrapper.active #launcher-icon {
            right: 100px !important;
            border-radius: 6px !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Data Link Eksternal
    const featuredItem = { title: "Pilih cerdas", url: "https://apxid.github.io/kelas9i/", icon: "🔍" };

    const mainData = [
        { title: "Galeri", url: "https://drive.google.com/drive/folders/1HqISHRK8AlwcFun7EUBvaALYhJUbh9de?usp=sharing", icon: "🌸" },
        { title: "Home", url: "https://apxid.github.io/kelas9i/", icon: "🏠" },
        { title: "WhatsApp", url: "https://chat.whatsapp.com/LG9ff5zCPxA847G7b82IRD", icon: "💬" },
        { title: "KAS", url: "https://apxid.github.io/kelas9i/kas/", icon: "💰" },
        { title: "TIK", url: "https://tik-spensamo.blogspot.com/", icon: "💻" },
        { title: "WEB", url: "https://smpn1moga.sch.id/", icon: "🌐" }
    ];

    const createItemElement = (item) => {
        const a = document.createElement('a');
        a.className = 'edge-item-wrapper';
        a.href = item.url;
        a.target = '_blank';
        a.innerHTML = `
            <div class="edge-icon-box">${item.icon}</div>
            <span class="edge-label">${item.title}</span>
        `;
        return a;
    };

    // 3. Injeksi Elemen HTML ke Kontainer Utama Web
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

            <div id="launcher-radial-menu">
                <div id="edge-featured-container" style="width:100%;"></div>
                <div class="edge-divider"></div>
                <div id="edge-main-container" style="width:100%; display:flex; flex-direction:column; gap:10px; align-items:center;"></div>
                <div class="edge-footer">
                    <button class="edge-footer-btn" title="Menu">:::</button>
                    <button class="edge-footer-btn" title="Edit">✏️</button>
                </div>
            </div>

            <div id="launcher-icon" onclick="toggleLauncherMenu()"></div>
        `;
        appContainer.appendChild(wrapper);

        // Render Item Atas (Pilih Cerdas)
        const featuredContainer = document.getElementById('edge-featured-container');
        if (featuredContainer) featuredContainer.appendChild(createItemElement(featuredItem));

        // Render Item Utama (Banyak Link)
        const mainContainer = document.getElementById('edge-main-container');
        if (mainContainer) {
            mainData.forEach((item) => {
                mainContainer.appendChild(createItemElement(item));
            });
        }
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
