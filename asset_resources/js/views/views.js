PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'column',

  modelEvents: {
    'change:title': 'render',
    'change:photo': 'render',

    'change:lat'  : 'updateMarker',
    'change:lng'  : 'updateMarker'
  },

  events: {
    'click .poi-delete-btn' : 'clear',
    'click .poi-info-btn'   : 'showDetails',
    'click .poi-edit-btn'   : 'showModal'
  },

  clear: function() {
    this.model.destroy();
    this.deleteMarker();
  },

  showModal: function() {
    this.trigger('poi:showModal');
  },

  showDetails: function() {
    var view = new PoiManager.DetailsView({model: this.model});

    PoiManager.detailsRegion.show(view);
  },

  _getCoords: function() {
    return _.map(['lat', 'lng'], function(c) {
      return parseFloat(this.model.get(c));
    }, this);
  },

  setMarker: function() {
    var model = this.model,
      coords = this._getCoords();
      size = _.size(_.compact(coords));

    if (!model.marker && size === 2) {
      model.marker = L.marker(coords).bindPopup();

      model.marker.on('dragend', function() {
        model.save(this.getLatLng());
      }).on('dblclick', function() {
        if (this.dragging.enabled()) {
          this.dragging.disable();
          this._icon.src = this._icon.src.replace('active-', '');
        } else {
          this.dragging.enable();
          this._icon.src = this._icon.src.replace('/images/marker', '/images/active-marker');
        }
      });

    } else if (size !== 2) {
      this.deleteMarker();
    }
  },

  updateMarker: function(e) {
    var model = this.model;

    this.setMarker();
    this.showMarker();

    if (model.marker) {
      this.model.marker.setLatLng(this._getCoords());
    }
  },

  showMarker: function() {
    var model = this.model;

    if (model.marker) {
      PoiManager.markers.addLayer(model.marker);
      model.marker.setPopupContent(model.get('title'));
    }
  },

  deleteMarker: function() {
    var model = this.model;

    if (model.marker) {
      PoiManager.markers.removeLayer(model.marker);
      model.marker = null;
    }
  },

  onRender: function(poiView) {
    this.setMarker();
    this.showMarker();
  }
});

PoiManager.PoisView = Marionette.CompositeView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui grid one column page',
  template: '#template-poi-list',
  childViewContainer: 'div.poi-list-items',

  events: {
    'click .poi-new-btn' : 'showModal'
  },

  ui: {
    mapClick: '.ui.slider.checkbox'
  },

  showModal: function(event, model) {
    var view = new PoiManager.ModalView({
      model: model || new PoiManager.Poi(),
      collection: this.collection
    });

    PoiManager.modalRegion.show(view);
    $('.ui.modal').modal('show');
  },

  onRender: function() {
    this.ui.mapClick.checkbox();
  },

  initialize: function() {
    var _this = this;

    this.on('childview:poi:showModal', function(childView){
      this.showModal(null, childView.model);
    });

    PoiManager.map.on('dblclick', function(e) {
      if (!_this.ui.mapClick.find('input').filter(':checked').length) {
        this.doubleClickZoom.enable();
        return;
      } else {
        this.doubleClickZoom.disable();
      }

      var model = new PoiManager.Poi({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });

      _this.showModal(null, model);
    });

  }
});

PoiManager.ModalView = Marionette.ItemView.extend({
  template: '#template-modal',
  className: 'ui modal',
  events: {
    'click .poi-save-btn'     : 'trySave',
    'change .poi-photo-file'  : 'tryUpload'
  },

  tryUpload: function(e) {
    var _this = this;

    if (!$(e.target).val()) {
      return;
    }

    this.$('form').ajaxSubmit({
      complete: function(xhr, textStatus) {
        var fileUrl = xhr.responseJSON.url;

        _this.$('.poi-photo').val(fileUrl);
        _this.$('.poi-photo-preview').attr('src', fileUrl);
      }
    });
  },

  trySave: function() {
    var arr = ['title', 'description', 'lat', 'lng', 'photo', 'time'], data = {};

    _.each(arr, function(selector) {
      data[selector] = this.$('.poi-' + selector).val();
    }, this);

    if (this.model.isNew()){
      this.collection.add(this.model);
    }

    this.model.save(data);
  }
});

PoiManager.DetailsView = Marionette.ItemView.extend({
  template: '#template-details',
  className: 'ui piled teal segment',

  modelEvents: {
    'change:time'         : 'render',
    'change:title'        : 'render',
    'change:description'  : 'render',
    'remove'              : 'clear'
  },

  clear: function() {
    PoiManager.detailsRegion.reset();
  }
});
