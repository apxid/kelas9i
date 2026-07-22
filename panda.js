(function() {
    // 1. Masukkan CSS Widget secara otomatis ke dalam <head>
    const style = document.createElement('style');
    style.innerHTML = `
        /* Styling Dasar */
        #panda-chat, #panda-icon { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important; }

        @media (max-width: 768px) {
            #panda-chat { width: 90% !important; max-width: 340px !important; right: 5% !important; left: 5% !important; margin: 0 auto !important; }
        }
        
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes tvOff { 0% { transform: scale(1, 1); opacity: 1; filter: brightness(1); } 50% { transform: scale(1, 0.05); filter: brightness(5); } 100% { transform: scale(0.01, 0); opacity: 0; filter: brightness(0); } }

        /* Icon (Dinaikkan ke 90px agar tidak menutupi menu bawah) */
        #panda-icon { position: fixed !important; bottom: 90px !important; right: 20px !important; cursor: pointer !important; z-index: 999999 !important; }
        #panda-icon img { width: 70px !important; height: auto !important; transition: transform 0.2s !important; }
        #panda-icon img:hover { transform: scale(1.1) !important; }
        
        /* Chatbox (Dinaikkan ke 90px agar sejajar dengan ikon) */
        #panda-chat { 
            position: fixed !important; bottom: 90px !important; right: 20px !important; width: 320px !important; height: 450px !important; 
            background: white !important; border-radius: 20px !important; box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; 
            display: none !important; flex-direction: column !important; overflow: visible !important; z-index: 999999 !important;
        }
        
        #panda-chat.open { display: flex !important; animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important; }
        #panda-chat.closing { animation: tvOff 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards !important; }
        
        .header { background: #075E54 !important; color: white !important; padding: 15px !important; display: flex !important; align-items: center !important; justify-content: space-between !important; border-radius: 20px 20px 0 0 !important; }
        .header-logo { width: 60px !important; height: auto !important; margin-right: 10px !important; margin-top: -30px !important; }
        
        #chat-body { flex: 1 !important; padding: 15px !important; overflow-y: auto !important; background: #e5ddd5 !important; display: flex !important; flex-direction: column !important; }
        
        .bubble { padding: 10px 14px !important; margin: 8px 15px !important; border-radius: 15px !important; max-width: 80% !important; font-size: 14.5px !important; line-height: 1.4 !important; position: relative !important; word-wrap: break-word !important; display: flex !important; flex-direction: column !important; }
        .panda { background: white !important; align-self: flex-start !important; border-bottom-left-radius: 0 !important; color: #303030 !important; }
        .user { background: #dcf8c6 !important; align-self: flex-end !important; border-bottom-right-radius: 0 !important; color: #303030 !important; }
        
        .meta-container { display: flex !important; align-items: center !important; align-self: flex-end !important; margin-top: 4px !important; gap: 3px !important; user-select: none !important; }
        .chat-time { font-size: 10px !important; color: #808080 !important; }
        .ticks { font-size: 11px !important; font-weight: bold !important; }
        .ticks.sent { color: #8696a0 !important; }
        .ticks.read { color: #53bdeb !important; }
        
        #input-area { padding: 10px !important; background: white !important; display: flex !important; border-radius: 0 0 20px 20px !important; align-items: center !important; }
        #user-input { flex: 1 !important; padding: 10px !important; border-radius: 20px !important; border: 1px solid #ddd !important; outline: none !important; }
        #send-btn { background: none !important; border: none !important; color: #075E54 !important; font-size: 24px !important; cursor: pointer !important; padding: 0 10px !important; }
    `;
    document.head.appendChild(style);

    // 2. Suntikkan HTML Elemen Widget & Audio ke dalam <body>
    const container = document.createElement('div');
    container.innerHTML = `
        <audio id="sound-open" src="https://www.soundjay.com/buttons/sounds/button-10.mp3"></audio>
        <audio id="sound-close" src="https://www.soundjay.com/buttons/sounds/button-16.mp3"></audio>

        <div id="panda-icon" onclick="openChat()"><img src="https://apxid.github.io/assistant/assets/mypanda.gif"/></div>

        <div id="panda-chat">
            <div class="header">
                <div style="display:flex; align-items:center;">
                    <img src="https://apxid.github.io/assistant/assets/panda.png" class="header-logo"/>
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

    // 3. Fungsi-fungsi JavaScript Widget
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
        const text = "PANDA ASSISTANT    ";
        let i = 0;
        function type() {
            el.innerText = text.substring(0, i);
            i = (i + 1) % (text.length + 1);
            window.typeTimer = setTimeout(type, 150);
        }
        type();
    };

    window.openChat = function() {
        document.getElementById('sound-open').play();
        document.getElementById('panda-icon').style.display = 'none';
        const chat = document.getElementById('panda-chat');
        chat.classList.remove('closing');
        chat.classList.add('open');
        window.startTypewriter();
        
        if (document.getElementById('chat-body').innerHTML === "") {
            const savedName = localStorage.getItem('panda_user');
            if (savedName) {
                window.addMessage(`Halo kembali ${savedName}! Ada yang bisa saya bantu?`, 'panda');
            } else {
                window.addMessage("Halo! Saya Panda. Siapa nama kamu?", 'panda');
                window.isWaitingForName = true;
            }
        }
    };

    window.closeChat = function() {
        document.getElementById('sound-close').play();
        clearTimeout(window.typeTimer);
        const chat = document.getElementById('panda-chat');
        chat.classList.remove('open');
        chat.classList.add('closing');
        setTimeout(() => {
            chat.style.display = 'none';
            document.getElementById('panda-icon').style.display = 'block';
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
            localStorage.setItem('panda_user', val);
            window.isWaitingForName = false;
            window.addMessage(`Halo ${val}! Apa yang ingin ditanyakan?`, 'panda');
            if (window.lastUserMessageElement) window.lastUserMessageElement.className = 'ticks read';
            return;
        }

        const typing = document.createElement('div');
        typing.className = 'bubble panda';
        typing.innerHTML = "<i>Panda sedang mengetik...</i>";
        document.getElementById('chat-body').appendChild(typing);
        
        try {
            const res = await fetch(`${window.GAS_URL}?question=${encodeURIComponent(val)}&userName=${encodeURIComponent(localStorage.getItem('panda_user') || 'Pengunjung')}`);
            const data = await res.json();
            typing.remove();
            if (window.lastUserMessageElement) window.lastUserMessageElement.className = 'ticks read';
            window.addMessage(data.answer, 'panda');
        } catch(err) {
            typing.remove();
            window.addMessage("Maaf, koneksi gagal.", 'panda');
        }
    };
})();
