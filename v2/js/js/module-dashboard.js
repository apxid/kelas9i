console.log("Modul Dashboard aktif");
(function() {
    loadInfoKelasBeranda();
    if (typeof Chart !== 'undefined') loadGrafikSiswa();
})();
