function initProfil() { checkPinAksesProfil(); }

function checkPinAksesProfil() {
    const lockScreen = document.getElementById('pin-lock-screen');
    if (isPinVerified) {
        if(lockScreen) lockScreen.classList.add('hidden');
        loadDropdownDaftarSiswa();
    } else if (lockScreen) {
        lockScreen.classList.remove('hidden');
    }
}

function verifikasiPinProfil() {
    const pin = document.getElementById('input-pin-akses').value;
    fetch(`${BACKEND_URL}?action=verifikasiPin&pin=${encodeURIComponent(pin)}`)
        .then(r => r.json())
        .then(res => {
            if (res.success) {
                isPinVerified = true;
                checkPinAksesProfil();
            } else {
                showAlert('Gagal', 'PIN Salah!');
            }
        });
}

function loadDropdownDaftarSiswa() {
    const select = document.getElementById('select-profil-siswa');
    callBackend('getData', { sheetName: 'BIODATA' }).then(data => {
        masterSidata = data;
        select.innerHTML = data.map((s, i) => `<option value="${s.NISN || s.nisn}">Absen ${s['No Absen']} : ${s['Nama Lengkap']}</option>`).join('');
    });
}

function renderDetailProfilSiswa(nisn) {
    const s = masterSidata.find(x => (x.NISN || x.nisn) == nisn);
    if (!s) return;
    Object.keys(s).forEach(key => {
        const el = document.getElementById(`prof-${key.replace(/\s+/g, '_')}`);
        if (el) el.innerText = s[key] || '-';
    });
    document.getElementById('prof-Foto').src = s['Foto'] || '';
    document.getElementById('detail-profil-container').classList.remove('hidden');
    document.getElementById('profil-placeholder').classList.add('hidden');
}

function navigateProfilSiswa(dir) {
    const select = document.getElementById('select-profil-siswa');
    const newIdx = select.selectedIndex + dir;
    if(newIdx >= 0 && newIdx < select.options.length) {
        select.selectedIndex = newIdx;
        renderDetailProfilSiswa(select.value);
    }
}
