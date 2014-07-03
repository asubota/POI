PoiManager.addRegions({
  modalRegion   :  '.poi-region-modal',
  poisRegion    :  '.poi-region-list',
  detailsRegion :  '.poi-region-details'
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
