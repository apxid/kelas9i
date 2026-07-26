(function() {
    // Jalankan eksekusi setelah document.body benar-benar siap
    const runScript = () => {
        if (document.getElementById('launcher-widget-wrapper')) return;

        // 1. Injeksi CSS Khusus
        const style = document.createElement('style');
        style.id = 'edge-panel-styles';
        style.innerHTML = `
            /* Container Root Utama (Garis terdepan layar) */
            #launcher-widget-wrapper {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 0 !important;
                height: 0 !important;
                z-index: 2147483647 !important; /* Nilai Z-Index Tertinggi di Browser */
            }

            #launcher-widget-wrapper * { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; 
                box-sizing: border-box !important;
            }

            /* Handle Samping Samsung One UI (Warna Biru Kontras Agara Pasti Kelihatan) */
            #launcher-icon { 
                position: fixed !important; 
                top: 50% !important; 
                right: 0 !important; 
                transform: translateY(-50%) !important;
                cursor: pointer !important; 
                z-index: 2147483647 !important; 
                width: 14px !important;
                height: 90px !important;
                background: linear-gradient(135deg, #0072ff, #00c6ff) !important;
                border-radius: 10px 0 0 10px !important;
                box-shadow: -3px 0 12px rgba(0,0,0,0.4) !important;
                border: 1px solid rgba(255, 255, 255, 0.6) !important;
                border-right: none !important;
                user-select: none !important;
                transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
            }
            
            #launcher-icon:hover {
                width: 18px !important;
                filter: brightness(1.2) !important;
            }

            #launcher-icon.clicked {
                transform: translateY(-50%) scale(0.9) !important;
            }

            /* Panel Utama Edge (Gelap Khas One UI) */
            #launcher-radial-menu {
                position: fixed !important;
                top: 50% !important;
                right: -140px !important;
                transform: translateY(-50%) !important;
                width: 110px !important;
                z-index: 2147483646 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                gap: 12px !important;
                padding: 20px 10px 16px 10px !important;
                background: rgba(24, 24, 27, 0.85) !important;
                backdrop-filter: blur(25px) saturation(180%) !important;
                -webkit-backdrop-filter: blur(25px) saturation(180%) !important;
                border-radius: 28px 0 0 28px !important;
                box-shadow: -10px 10px 35px rgba(0, 0, 0, 0.5) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                border-right: none !important;
                transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
                opacity: 0 !important;
                pointer-events: none !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            }

            /* Garis Pemisah Putus-Putus */
            .edge-divider {
                width: 80% !important;
                border-top: 1.5px dotted rgba(255, 255, 255, 0.35) !important;
                margin: 2px 0 !important;
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

            /* Formasi Ikon Squircle */
            .edge-icon-box {
                width: 48px !important;
                height: 48px !important;
                border-radius: 16px !important;
                background: rgba(255, 255, 255, 0.12) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 22px !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }

            .edge-item-wrapper:hover .edge-icon-box {
                background: rgba(255, 255, 255, 0.25) !important;
            }

            /* Label Teks Nama Aplikasi */
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

            /* Menu Bawah (Footer) */
            .edge-footer {
                display: flex !important;
                justify-content: space-around !important;
                width: 100% !important;
                padding-top: 8px !important;
                border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
            }

            .edge-footer-btn {
                background: transparent !important;
                border: none !important;
                color: rgba(255, 255, 255, 0.8) !important;
                font-size: 15px !important;
                cursor: pointer !important;
            }

            /* Efek Terbuka */
            #launcher-widget-wrapper.active #launcher-radial-menu {
                right: 0 !important;
                opacity: 1 !important;
                pointer-events: auto !important;
            }
            
            #launcher-widget-wrapper.active #launcher-icon {
                right: 110px !important;
            }
        `;
        document.head.appendChild(style);

        // 2. Data Link
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

        // 3. Buat Elemen HTML
        const wrapper = document.createElement('div');
        wrapper.id = 'launcher-widget-wrapper';
        wrapper.innerHTML = `
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

        document.body.appendChild(wrapper);

        // Append Items
        const featuredContainer = document.getElementById('edge-featured-container');
        if (featuredContainer) featuredContainer.appendChild(createItemElement(featuredItem));

        const mainContainer = document.getElementById('edge-main-container');
        if (mainContainer) {
            mainData.forEach(item => mainContainer.appendChild(createItemElement(item)));
        }

        // Toggle Event
        const handleIcon = document.getElementById('launcher-icon');
        if (handleIcon) {
            handleIcon.addEventListener('click', () => {
                handleIcon.classList.add('clicked');
                setTimeout(() => handleIcon.classList.remove('clicked'), 200);
                wrapper.classList.toggle('active');
            });
        }
    };

    if (document.body) {
        runScript();
    } else {
        window.addEventListener('DOMContentLoaded', runScript);
    }
})();
