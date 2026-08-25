(function() {
    // 1. CSS Tampilan One UI Samsung Edge Panel (Full Rounded Capsule)
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-widget-wrapper, #launcher-widget-wrapper * { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; 
            box-sizing: border-box !important;
        }

        /* Handle Garis Samping Samsung Edge Panel */
        #launcher-icon { 
            position: absolute !important; 
            top: 50% !important; 
            right: 0 !important; 
            transform: translateY(-50%) !important;
            cursor: pointer !important; 
            z-index: 999999 !important; 
            width: 5px !important;
            height: 75px !important;
            background: rgba(255, 255, 255, 0.5) !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            border-radius: 4px 0 0 4px !important;
            box-shadow: -2px 0 6px rgba(0,0,0,0.2) !important;
            user-select: none !important;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        
        #launcher-icon:hover {
            width: 8px !important;
            background: rgba(255, 255, 255, 0.8) !important;
        }

        #launcher-icon.clicked {
            transform: translateY(-50%) scale(0.9) !important;
        }

        /* Container Panel Utama Samsung Edge */
        #launcher-radial-menu {
            position: absolute !important;
            top: 50% !important;
            right: -100px !important;
            transform: translateY(-50%) !important;
            width: 72px !important;
            z-index: 999998 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 14px 6px 14px 6px !important;
            background: rgba(30, 30, 32, 0.8) !important;
            backdrop-filter: blur(25px) saturation(180%) !important;
            -webkit-backdrop-filter: blur(25px) saturation(180%) !important;
            border-radius: 22px !important;
            box-shadow: -4px 6px 25px rgba(0, 0, 0, 0.4) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            transition: right 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease !important;
            opacity: 0 !important;
            pointer-events: none !important;
            max-height: 88vh !important;
            overflow-y: auto !important;
            scrollbar-width: none !important;
        }

        #launcher-radial-menu::-webkit-scrollbar {
            display: none;
        }

        /* Item Aplikasi */
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
            transform: scale(1.08) !important;
        }

        /* Ikon Squircle One UI */
        .edge-icon-box {
            width: 38px !important;
            height: 38px !important;
            border-radius: 12px !important;
            background: rgba(255, 255, 255, 0.15) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 17px !important;
            box-shadow: 0 3px 8px rgba(0,0,0,0.2) !important;
            border: 1px solid rgba(255, 255, 255, 0.18) !important;
            transition: background 0.2s ease !important;
        }

        .edge-item-wrapper:hover .edge-icon-box {
            background: rgba(255, 255, 255, 0.28) !important;
        }

        /* Label Teks di Bawah Ikon */
        .edge-label {
            margin-top: 3px !important;
            color: #FFFFFF !important;
            font-size: 9px !important;
            font-weight: 400 !important;
            text-align: center !important;
            max-width: 64px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important;
            line-height: 1.1 !important;
        }

        /* Status Aktif Panel Terbuka */
        #launcher-widget-wrapper.active #launcher-radial-menu {
            right: 5px !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        #launcher-widget-wrapper.active #launcher-icon {
            right: 80px !important;
            border-radius: 4px !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Data Link Eksternal Utama
    const mainData = [
        { title: "Galeri", url: "https://drive.google.com/drive/folders/1HqISHRK8AlwcFun7EUBvaALYhJUbh9de?usp=sharing", icon: "🌸" },
        { title: "Card", url: "https://apxid.github.io/kelas9i/card", icon: "🪪" }, // Ikon diubah ke ID Card
        { title: "WhatsApp", url: "https://chat.whatsapp.com/LG9ff5zCPxA847G7b82IRD", icon: "💬" },
        { title: "KAS", url: "https://apxid.github.io/kelas9i/kas/", icon: "💰" },
        { title: "TIK", url: "https://tik-spensamo.blogspot.com/", icon: "💻" },
        { title: "Home", url: "https://apxid.github.io/kelas9i", icon: "🌐" }
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

    // 3. Injeksi Elemen HTML ke Kontainer Utama
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
                <div id="edge-main-container" style="width:100%; display:flex; flex-direction:column; gap:8px; align-items:center;"></div>
            </div>

            <div id="launcher-icon" onclick="toggleLauncherMenu()"></div>
        `;
        appContainer.appendChild(wrapper);

        // Render Item Utama
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
