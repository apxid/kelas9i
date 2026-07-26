(function() {
    // 1. Injeksi CSS Tampilan One UI Samsung Edge Panel
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-widget-wrapper, #launcher-widget-wrapper * { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important; 
            box-sizing: border-box !important;
        }

        /* Handle Samping Khas Samsung (Dibuat Lebih Jelas & Mudah Diklik) */
        #launcher-icon { 
            position: fixed !important; 
            top: 50% !important; 
            right: 0 !important; 
            transform: translateY(-50%) !important;
            cursor: pointer !important; 
            z-index: 9999999 !important; 
            width: 10px !important;
            height: 90px !important;
            background: rgba(100, 100, 100, 0.6) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border-radius: 8px 0 0 8px !important;
            box-shadow: -2px 0 10px rgba(0,0,0,0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-right: none !important;
            user-select: none !important;
            transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        
        #launcher-icon:hover {
            width: 14px !important;
            background: rgba(0, 0, 0, 0.75) !important;
        }

        #launcher-icon.clicked {
            transform: translateY(-50%) scale(0.9) !important;
        }

        /* Container Panel Utama Khas Samsung One UI */
        #launcher-radial-menu {
            position: fixed !important;
            top: 50% !important;
            right: -140px !important;
            transform: translateY(-50%) !important;
            width: 110px !important;
            z-index: 9999998 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 14px !important;
            padding: 20px 10px 16px 10px !important;
            background: rgba(24, 24, 27, 0.75) !important;
            backdrop-filter: blur(30px) saturation(180%) !important;
            -webkit-backdrop-filter: blur(30px) saturation(180%) !important;
            border-radius: 28px 0 0 28px !important;
            box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.4) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            border-right: none !important;
            transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
            opacity: 0 !important;
            pointer-events: none !important;
            max-height: 90vh !important;
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
            margin: -2px 0 2px 0 !important;
        }

        /* Pembungkus Item Aplikasi */
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

        /* Ikon Squircle One UI */
        .edge-icon-box {
            width: 50px !important;
            height: 50px !important;
            border-radius: 16px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 22px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(5px) !important;
            -webkit-backdrop-filter: blur(5px) !important;
            transition: background 0.2s ease !important;
        }

        .edge-item-wrapper:hover .edge-icon-box {
            background: rgba(255, 255, 255, 0.3) !important;
        }

        /* Label Nama Aplikasi */
        .edge-label {
            margin-top: 4px !important;
            color: #FFFFFF !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            text-align: center !important;
            max-width: 85px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            text-shadow: 0 1px 3px rgba(0,0,0,0.8) !important;
        }

        /* Footer Menu */
        .edge-footer {
            display: flex !important;
            justify-content: space-around !important;
            width: 100% !important;
            padding-top: 6px !important;
            margin-top: 2px !important;
            border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
        }

        .edge-footer-btn {
            background: transparent !important;
            border: none !important;
            color: rgba(255, 255, 255, 0.8) !important;
            font-size: 16px !important;
            cursor: pointer !important;
            padding: 4px !important;
        }

        /* Status Aktif Panel Terbuka */
        #launcher-widget-wrapper.active #launcher-radial-menu {
            right: 0 !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        #launcher-widget-wrapper.active #launcher-icon {
            right: 110px !important;
        }
    `;

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

    // 3. Fungsi Injeksi DOM
    const initWidget = () => {
        if (document.getElementById('launcher-widget-wrapper')) return;

        // Pastikan style terpasang di head
        if (!document.head.contains(style)) {
            document.head.appendChild(style);
        }

        const wrapper = document.createElement('div');
        wrapper.id = 'launcher-widget-wrapper';
        wrapper.innerHTML = `
            <audio id="sound-open" src="https://www.soundjay.com/buttons/sounds/button-10.mp3" preload="auto"></audio>
            <audio id="sound-close" src="https://www.soundjay.com/buttons/sounds/button-16.mp3" preload="auto"></audio>

            <div id="launcher-radial-menu">
                <div id="edge-featured-container" style="width:100%;"></div>
                <div class="edge-divider"></div>
                <div id="edge-main-container" style="width:100%; display:flex; flex-direction:column; gap:12px; align-items:center;"></div>
                <div class="edge-footer">
                    <button class="edge-footer-btn" title="Menu">:::</button>
                    <button class="edge-footer-btn" title="Edit">✏️</button>
                </div>
            </div>

            <div id="launcher-icon"></div>
        `;

        (document.body || document.documentElement).appendChild(wrapper);

        // Render Item
        const featuredContainer = document.getElementById('edge-featured-container');
        if (featuredContainer) featuredContainer.appendChild(createItemElement(featuredItem));

        const mainContainer = document.getElementById('edge-main-container');
        if (mainContainer) {
            mainData.forEach((item) => {
                mainContainer.appendChild(createItemElement(item));
            });
        }

        // Pasang event listener klik pada handle
        const handleIcon = document.getElementById('launcher-icon');
        if (handleIcon) {
            handleIcon.addEventListener('click', window.toggleLauncherMenu);
        }
    };

    // 4. Buka / Tutup Panel
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

    // Jalankan skrip saat DOM siap
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initWidget();
    } else {
        document.addEventListener('DOMContentLoaded', initWidget);
    }
})();
