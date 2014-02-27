function main() {
    $('#tabs').tabs();
    google.setOnLoadCallback(googleReady);
}

function googleReady() {
    init_import_export();
    init_hscodes();
    worldMap();
    usaMap();
}
$(main);
