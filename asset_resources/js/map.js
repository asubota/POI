var MAP = {
  map: L.map('map', {maxZoom: 18}).setView([50.414124, 30.522423], 13),
  options: {
    dblclickToAddMarker: false,
    markerClustering: true
  },
  getCoords: function(model) {
    return _.map(['lat', 'lng'], function(c) {
      return parseFloat(model.get(c));
    });
  },
  markerAdd: function(model) {
    var coords = this.getCoords(model),
      size = _.size(_.compact(coords));

    if (size === 2) {
      model.marker = L.marker(coords).bindPopup(model.get('title'));
      this._bindMarker(model);
      this.currentMarkersGroup().addLayer(model.marker);
    }
  },
  markerDelete: function(model) {
    if (model.marker) {
      this.currentMarkersGroup().removeLayer(model.marker);
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
      this.markerAdd(model);
    } else {
      coords = this.getCoords(model);
      size = _.size(_.compact(coords));

      if (size === 2) {
        model.marker.setLatLng(coords);
      } else {
        this.markerDelete(model);
      }
    }
  },
  markerUpdate: function(model) {
    this._updateMarkerTitle(model);
    this._updateMarkerGeo(model);
  },
  markers: {
    cluster: L.markerClusterGroup({spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false }),
    common: L.layerGroup()
  },
  currentMarkersGroup: function() {
    if (this.options.markerClustering) {
      return this.markers.cluster;
    } else {
      return this.markers.common;
    }
  }
};

_.each(MAP.markers, function(group) {
  group.addTo(MAP.map);
});

MAP.markers.cluster.on('clusterclick', function (event) {
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

PoiManager.vent.on('map:marker:delete', function(model) {
  MAP.markerDelete(model);
});

PoiManager.vent.on('map:marker:update', function(model) {
  MAP.markerUpdate(model);
});

PoiManager.vent.on('map:option:dblclick', function(value) {
  MAP.options.dblclickToAddMarker = value;
});

PoiManager.vent.on('map:option:cluster', function(value) {
  var currentGroup = MAP.currentMarkersGroup(),
    markers = currentGroup.getLayers();

  currentGroup.clearLayers();
  MAP.options.markerClustering = value;

  _.each(markers, function(marker) {
    this.addLayer(marker);
  }, MAP.currentMarkersGroup());
});

MAP.map.on('dblclick', function(e) {
  if (!MAP.options.dblclickToAddMarker) {
    this.doubleClickZoom.enable();
    return;
  } else {
    this.doubleClickZoom.disable();
  }

  PoiManager.vent.trigger('map:marker:new', e.latlng);
});
