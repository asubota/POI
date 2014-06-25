var map = L.map('map').setView([51, 31], 10);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

PoiManager.addRegions({
  modalRegion: '.poi-modal-region',
  poisRegion:  '.poi-list-region',
});

PoiManager.on('start', function(){
  var pois = new PoiManager.PoiCollection();
  pois.fetch();

  var poisView = new PoiManager.PoisView({
    collection: pois
  });

  PoiManager.poisRegion.show(poisView);
});

PoiManager.start();
