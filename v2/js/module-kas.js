console.log("Modul Kas aktif");
(function() {
    // Logika khusus untuk menampilkan tabel keuangan kelas
    loadDataKas();
})();

function loadDataKas() {
    callBackend('getData', { sheetName: 'KAS' }).then(data => {
        // Render data kas
    });
}
