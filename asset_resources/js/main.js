new AppView();

var map = L.map('map').setView([51, 31], 10);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);
