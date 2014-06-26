PoiManager.map = L.map('map').setView([50.414124, 30.522423], 13);
L.Icon.Default.imagePath = '/images';
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(PoiManager.map);
PoiManager.markers = L.layerGroup().addTo(PoiManager.map);

PoiManager.map.on('click', function(e) {
  // console.log(e.latlng);
});

PoiManager.addRegions({
  modalRegion   :  '.poi-modal-region',
  poisRegion    :  '.poi-list-region',
  detailsRegion :  '.poi-details-region',
});

PoiManager.on('start', function(){
  var pois = new PoiManager.PoiCollection();

  pois.fetch({success: function(data) {
    var poisView = new PoiManager.PoisView({
      collection: data
    });
    PoiManager.poisRegion.show(poisView);
  }});
});

PoiManager.start();
