(function() {
    // 1. Injeksi CSS ke <head>
    const style = document.createElement('style');
    style.innerHTML = `
        #launcher-chat, #launcher-icon { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; 
        }

        @keyframes slideUp { 
            from { transform: translateY(100%); opacity: 0; } 
            to { transform: translateY(0); opacity: 1; } 
        }
        @keyframes tvOff { 
            0% { transform: scale(1, 1); opacity: 1; filter: brightness(1); } 
            50% { transform: scale(1, 0.05); filter: brightness(5); } 
            100% { transform: scale(0.01, 0); opacity: 0; filter: brightness(0); } 
        }

        /* Icon Floating Launcher */
        #launcher-icon { 
            position: fixed !important; 
            bottom: 20px !important; 
            right: 20px !important; 
            cursor: pointer !important; 
            z-index: 999999 !important; 
            background: transparent !important;
        }
        #launcher-icon img { 
            width: 60px !important; 
            height: auto !important; 
            transition: transform 0.2s !important; 
        }
        #launcher-icon img:hover { 
            transform: scale(1.1) !important; 
        }
        
        /* Chatbox Floating Container */
        #launcher-chat { 
            position: fixed !important; 
            bottom: 20px !important; 
            right: 20px !important; 
            width: 330px !important; 
            max-width: calc(100vw - 40px) !important;
            height: 430px !important; 
            background: rgba(255, 255, 255, 0.95) !important; 
            backdrop-filter: blur(10px) !important;
            border-radius: 20px !important; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; 
            display: none !important; 
            flex-direction: column !important; 
            overflow: hidden !important; 
            z-index: 999999 !important;
        }
        
        #launcher-chat.open { 
            display: flex !important; 
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; 
        }
        #launcher-chat.closing { 
            animation: tvOff 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards !important; 
        }
        
        .header { 
            background: #075E54 !important; 
            color: white !important; 
            padding: 15px !important; 
            display: flex !important; 
            align-items: center !important; 
            justify-content: space-between !important; 
            border-radius: 20px 20px 0 0 !important; 
        }
        .header-logo { 
            width: 40px !important; 
            height: auto !important; 
            margin-right: 10px !important; 
        }
        
        #chat-body { 
            flex: 1 !important; 
            padding: 15px !important; 
            overflow-y: auto !important; 
            background: rgba(229, 221, 213, 0.6) !important; 
            display: flex !important; 
            flex-direction: column !important; 
        }
        
        .bubble { 
            padding: 10px 14px !important; 
            margin: 8px 0 !important; 
            border-radius: 15px !important; 
            max-width: 80% !important; 
            font-size: 14px !important; 
            line-height: 1.4 !important; 
            position: relative !important; 
            word-wrap: break-word !important; 
            display: flex !important; 
            flex-direction: column !important; 
        }
        .launcher { 
            background: white !important; 
            align-self: flex-start !important; 
            border-bottom-left-radius: 0 !important; 
            color: #303030 !important; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        .user { 
            background: #dcf8c6 !important; 
            align-self: flex-end !important; 
            border-bottom-right-radius: 0 !important; 
            color: #303030 !important; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        }
        
        .meta-container { 
            display: flex !important; 
            align-items: center !important; 
            align-self: flex-end !important; 
            margin-top: 4px !important; 
            gap: 3px !important; 
            user-select: none !important; 
        }
        .chat-time { 
            font-size: 10px !important; 
            color: #808080 !important; 
        }
        .ticks { 
            font-size: 11px !important; 
            font-weight: bold !important; 
        }
        .ticks.sent { color: #8696a0 !important; }
        .ticks.read { color: #53bdeb !important; }
        
        #input-area { 
            padding: 10px !important; 
            background: white !important; 
            display: flex !important; 
            border-radius: 0 0 20px 20px !important; 
            align-items: center !important; 
        }
        #user-input { 
            flex: 1 !important; 
            padding: 10px 14px !important; 
            border-radius: 20px !important; 
            border: 1px solid #ddd !important; 
            outline: none !important; 
        }
        #send-btn { 
            background: none !important; 
            border: none !important; 
            color: #075E54 !important; 
            font-size: 20px !important; 
            cursor: pointer !important; 
            padding: 0 10px !important; 
        }
    `;
    document.head.appendChild(style);

    // 2. Fungsi tempel elemen langsung ke Document Body
    const initWidget = () => {
        if (document.getElementById('launcher-widget-wrapper')) return;

        const container = document.createElement('div');
        container.id = 'launcher-widget-wrapper';
        container.innerHTML = `
            <audio id="sound-open" src="https://www.soundjay.com/buttons/sounds/button-10.mp3" preload="auto"></audio>
            <audio id="sound-close" src="https://www.soundjay.com/buttons/sounds/button-16.mp3" preload="auto"></audio>

            <div id="launcher-icon" onclick="openChat()">
                <img src="https://apxid.github.io/assistant/assets/mypanda.gif" alt="Launcher Icon"/>
            </div>

            <div id="launcher-chat">
                <div class="header">
                    <div style="display:flex; align-items:center;">
                        <img src="https://apxid.github.io/assistant/assets/panda.png" class="header-logo" alt="Logo"/>
                        <span id="app-name" style="font-weight:600; font-size:15px;"></span>
                    </div>
                    <button onclick="closeChat()" style="background:none; border:none; color:white; font-size:20px; cursor:pointer;">×</button>
                </div>
                <div id="chat-body"></div>
                <div id="input-area">
                    <input type="text" id="user-input" placeholder="Ketik pesan..." onkeydown="if(event.key==='Enter') sendMessage()"/>
                    <button id="send-btn" onclick="sendMessage()">➤</button>
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

    // 3. Logika & Metode JavaScript
    window.GAS_URL = "https://script.google.com/macros/s/AKfycbxmTinumB5E5iXvEnmYMZmvTwyjI-x_Wxm43BFAXSKsHQKP3ypxZ2QhzpdKLup07Ubx/exec";
    window.isWaitingForName = false;
    window.typeTimer = null;
    window.lastUserMessageElement = null;

    window.getFormattedTime = function() {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    window.startTypewriter = function() {
        const el = document.getElementById('app-name');
        if (!el) return;
        const text = "LAUNCHER ASSISTANT    ";
        let i = 0;
        
        if (window.typeTimer) clearInterval(window.typeTimer);
        
        function type() {
            el.innerText = text.substring(0, i);
            i = (i + 1) % (text.length + 1);
        }
        window.typeTimer = setInterval(type, 150);
    };

    window.openChat = function() {
        const soundOpen = document.getElementById('sound-open');
        if (soundOpen) soundOpen.play().catch(() => {});

        document.getElementById('launcher-icon').style.display = 'none';
        const chat = document.getElementById('launcher-chat');
        chat.style.display = 'flex';
        chat.classList.remove('closing');
        chat.classList.add('open');
        
        window.startTypewriter();
        
        if (document.getElementById('chat-body').innerHTML === "") {
            const savedName = localStorage.getItem('launcher_user');
            if (savedName) {
                window.addMessage(`Halo kembali ${savedName}! Ada yang bisa saya bantu?`, 'launcher');
            } else {
                window.addMessage("Halo! Saya Launcher Assistant. Siapa nama kamu?", 'launcher');
                window.isWaitingForName = true;
            }
        }
    };

    window.closeChat = function() {
        const soundClose = document.getElementById('sound-close');
        if (soundClose) soundClose.play().catch(() => {});

        if (window.typeTimer) clearInterval(window.typeTimer);
        const chat = document.getElementById('launcher-chat');
        chat.classList.remove('open');
        chat.classList.add('closing');
        
        setTimeout(() => {
            chat.style.display = 'none';
            document.getElementById('launcher-icon').style.display = 'block';
        }, 500);
    };

    window.addMessage = function(text, sender) {
        const body = document.getElementById('chat-body');
        const div = document.createElement('div');
        div.className = `bubble ${sender}`;
        div.innerHTML = `<span>${text}</span><div class="meta-container"><span class="chat-time">${window.getFormattedTime()}</span></div>`;
        
        if (sender === 'user') {
            const ticks = document.createElement('span');
            ticks.className = 'ticks sent';
            ticks.innerHTML = '&#10004;&#10004;';
            div.querySelector('.meta-container').appendChild(ticks);
            window.lastUserMessageElement = ticks;
        }
        
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    };

    window.sendMessage = async function() {
        const input = document.getElementById('user-input');
        const val = input.value.trim();
        if (!val) return;

        window.addMessage(val, 'user');
        input.value = '';

        if (window.isWaitingForName) {
            localStorage.setItem('launcher_user', val);
            window.isWaitingForName = false;
            window.addMessage(`Halo ${val}! Apa yang ingin ditanyakan?`, 'launcher');
            if (window.lastUserMessageElement) window.lastUserMessageElement.className = 'ticks read';
            return;
        }

        const typing = document.createElement('div');
        typing.className = 'bubble launcher';
        typing.innerHTML = "<i>Sedang mengetik...</i>";
        document.getElementById('chat-body').appendChild(typing);
        
        try {
            const res = await fetch(`${window.GAS_URL}?question=${encodeURIComponent(val)}&userName=${encodeURIComponent(localStorage.getItem('launcher_user') || 'Pengunjung')}`);
            const data = await res.json();
            typing.remove();
            if (window.lastUserMessageElement) window.lastUserMessageElement.className = 'ticks read';
            window.addMessage(data.answer, 'launcher');
        } catch(err) {
            typing.remove();
            window.addMessage("Maaf, koneksi gagal.", 'launcher');
        }
    };
})();
