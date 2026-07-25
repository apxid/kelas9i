(function() {
    // 1. Injeksi CSS Khusus Menu Link External
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-menu-popup, #launcher-icon { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
        }

        @keyframes slideUp { 
            from { transform: translateY(20px) scale(0.95); opacity: 0; } 
            to { transform: translateY(0) scale(1); opacity: 1; } 
        }

        /* Icon Floating Launcher (Dinaikkan ke 80px agar pas di atas elemen lain) */
        #launcher-icon { 
            position: fixed !important; 
            bottom: 80px !important; 
            right: 20px !important; 
            cursor: pointer !important; 
            z-index: 999999 !important; 
            background: transparent !important;
        }
        #launcher-icon img { 
            width: 60px !important; 
            height: auto !important; 
            transition: transform 0.2s ease-in-out !important; 
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)) !important;
        }
        #launcher-icon img:hover { 
            transform: scale(1.1) !important; 
        }
        
        /* Popup Menu External Link (Melayang di atas ikon launcher) */
        #launcher-menu-popup { 
            position: fixed !important; 
            bottom: 150px !important; 
            right: 20px !important; 
            width: 280px !important; 
            background: rgba(255, 255, 255, 0.95) !important; 
            backdrop-filter: blur(10px) !important;
            border-radius: 16px !important; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; 
            display: none !important; 
            flex-direction: column !important; 
            overflow: hidden !important; 
            z-index: 999999 !important;
            border: 1px solid rgba(0,0,0,0.08) !important;
        }
        
        #launcher-menu-popup.open { 
            display: flex !important; 
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; 
        }

        .launcher-header { 
            background: #075E54 !important; 
            color: white !important; 
            padding: 12px 15px !important; 
            display: flex !important; 
            align-items: center !important; 
            justify-content: space-between !important; 
            font-weight: 600 !important;
            font-size: 14px !important;
        }

        .launcher-links-container {
            padding: 12px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            background: rgba(229, 221, 213, 0.4) !important;
        }

        .external-link-btn {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 10px 14px !important;
            background: white !important;
            color: #303030 !important;
            text-decoration: none !important;
            border-radius: 12px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
            transition: all 0.2s ease !important;
        }

        .external-link-btn:hover {
            background: #dcf8c6 !important;
            transform: translateX(-3px) !important;
        }

        .external-link-btn span {
            font-size: 16px !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Injeksi Elemen HTML ke DOM
    const initWidget = () => {
        if (document.getElementById('launcher-widget-wrapper')) return;

        const container = document.createElement('div');
        container.id = 'launcher-widget-wrapper';
        container.innerHTML = `
            <audio id="sound-open" src="https://www.soundjay.com/buttons/sounds/button-10.mp3" preload="auto"></audio>
            <audio id="sound-close" src="https://www.soundjay.com/buttons/sounds/button-16.mp3" preload="auto"></audio>

            <!-- Ikon Launcher -->
            <div id="launcher-icon" onclick="toggleLauncherMenu()">
                <img src="https://apxid.github.io/kelas9i/assets/launcher.png" alt="Launcher Icon"/>
            </div>

            <!-- Card Menu External Links -->
            <div id="launcher-menu-popup">
                <div class="launcher-header">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="https://apxid.github.io/kelas9i/assets/launcher.png" style="width:24px; height:auto;" alt="Logo"/>
                        <span>Launcher</span>
                    </div>
                    <button onclick="toggleLauncherMenu()" style="background:none; border:none; color:white; font-size:18px; cursor:pointer;">×</button>
                </div>
                <div class="launcher-links-container">
                    <a href="https://apxid.github.io/kelas9i/kas" target="_blank" class="external-link-btn">
                        <span>🚀</span> KAS
                    </a>
                    <a href="https://apxid.github.io/kelas9i/" target="_blank" class="external-link-btn">
                        <span>📚</span> Home
                    </a>
                    <a href="https://tik-spensamo.blogspot.com/" target="_blank" class="external-link-btn">
                        <span>📝</span> LMS Informatika
                    </a>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }

    // 3. Logika Buka / Tutup Menu External Link
    window.toggleLauncherMenu = function() {
        const menu = document.getElementById('launcher-menu-popup');
        const soundOpen = document.getElementById('sound-open');
        const soundClose = document.getElementById('sound-close');

        if (!menu) return;

        if (menu.classList.contains('open')) {
            if (soundClose) soundClose.play().catch(() => {});
            menu.classList.remove('open');
            setTimeout(() => { 
                menu.style.display = 'none'; 
            }, 200);
        } else {
            if (soundOpen) soundOpen.play().catch(() => {});
            menu.style.display = 'flex';
            menu.classList.add('open');
        }
    };
})();
