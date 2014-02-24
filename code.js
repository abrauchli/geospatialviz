function main() {
    $('#tabs').tabs();
    google.setOnLoadCallback(googleReady);
}

function googleReady() {
    worldMap();
    usaMap();
}
$(main);
