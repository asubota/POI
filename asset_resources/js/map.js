var MAP = {
  map: L.map('map', {maxZoom: 18}).setView([50.414124, 30.522423], 13),
  options: {
    dblclickToAddMarker: false
  },
  getCoords: function(model) {
    return _.map(['lat', 'lng'], function(c) {
      return parseFloat(model.get(c));
    });
  },
  markerAdd: function(model) {
    var coords = MAP.getCoords(model),
      size = _.size(_.compact(coords));

    if (size === 2) {
      model.marker = L.marker(coords).bindPopup(model.get('title'));
      MAP.markers.addLayer(model.marker);
      MAP._bindMarker(model);
    }
  },
  markerDelete: function(model) {
    if (model.marker) {
      MAP.markers.removeLayer(model.marker);
      model.marker = null;
    }
  },
  _bindMarker:function(model) {
    model.marker.on('dragend', function() {
      model.save(this.getLatLng());
    });

    model.marker.on('dblclick', function() {
      if (this.dragging.enabled()) {
        this.dragging.disable();
        this._icon.src = this._icon.src.replace('active-', '');
      } else {
        this.dragging.enable();
        this._icon.src = this._icon.src.replace('/images/marker', '/images/active-marker');
      }
    });

    model.marker.on('click', function(event) {
      PoiManager.vent.trigger('map:marker:click', model);
    });
  },
  _updateMarkerTitle: function(model) {
    if (model.marker) {
      model.marker.setPopupContent(model.get('title'));
    }
  },
  _updateMarkerGeo: function(model) {
    var coords, size;

    if (!model.marker) {
      MAP.markerAdd(model);
    } else {
      coords = MAP.getCoords(model);
      size = _.size(_.compact(coords));

      if (size === 2) {
        model.marker.setLatLng(coords);
      } else {
        MAP.markerDelete(model);
      }
    }
  },
  markerUpdate: function(model) {
    MAP._updateMarkerTitle(model);
    MAP._updateMarkerGeo(model);
  }
};

MAP.markers = L.markerClusterGroup({spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false }).addTo(MAP.map);
MAP.markers.on('clusterclick', function (event) {
  event.layer.zoomToBounds();
});

L.Icon.Default.imagePath = '/images';
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(MAP.map);

PoiManager.vent.on('map:marker:panto', function(model) {
  if (model.marker) {
    MAP.map.panTo(model.marker._latlng);
    model.marker.openPopup();
  }
});

PoiManager.vent.on('map:marker:add', function(model) {
  MAP.markerAdd(model);
});

PoiManager.vent.on('map:marker:delete', function(model) {
  MAP.markerDelete(model);
});

PoiManager.vent.on('map:marker:update', function(model) {
  MAP.markerUpdate(model);
});

PoiManager.vent.on('map:option:dblclick', function(value) {
  MAP.options.dblclickToAddMarker = value;
});

MAP.map.on('dblclick', function(e) {
  var model;

  if (!MAP.options.dblclickToAddMarker) {
    this.doubleClickZoom.enable();
    return;
  } else {
    this.doubleClickZoom.disable();
  }

  model = new PoiManager.Poi({
    lat: e.latlng.lat,
    lng: e.latlng.lng
  });

  PoiManager.vent.trigger('map:marker:add', model);
});
