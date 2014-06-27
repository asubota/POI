PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'column',

  modelEvents: {
    'change:title': 'render',
    'change:photo': 'render'
  },

  events: {
    'click .poi-delete-btn' : 'clear',
    'click .poi-info-btn'   : 'showDetails',
    'click .poi-edit-btn'   : 'showModal'
  },

  clear: function() {
    this.model.destroy();
  },

  showModal: function() {
    this.trigger('poi:showModal');
  },

  showDetails: function() {
    var view = new PoiManager.DetailsView({model: this.model});

    PoiManager.detailsRegion.show(view);
  },

  onRender: function(poiView) {
    console.log( 'render' );
    var model = poiView.model,
      coords = _.map(['lat', 'lng'], function(s) {
        return parseFloat(model.get(s));
      }), marker;

    if (_.size(_.compact(coords)) === 2) {
      if (!model.marker) {
        model.marker = L.marker(coords, {draggable: true}).bindPopup();
        model.marker.on('dragend', function() {
          model.save(this.getLatLng());
        });
      }

      model.marker.setPopupContent(model.get('title'));
      PoiManager.markers.addLayer(model.marker);
    }
  }
});

PoiManager.PoisView = Marionette.CompositeView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui grid',
  template: '#template-poi-list',
  childViewContainer: 'div.poi-list-items',

  events: {
    'click .poi-new-btn' : 'showModal'
  },

  showModal: function(event, model) {
    var view = new PoiManager.ModalView({
      model: model || new PoiManager.Poi(),
      collection: this.collection
    });

    PoiManager.modalRegion.show(view);
    $('.ui.modal').modal('show');
  },

  initialize: function() {
    this.on('childview:poi:showModal', function(childView){
      this.showModal(null, childView.model);
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

    _.each(arr, function(el) {
      data[el] = this.$('.poi-'+el).val();
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
    'change': 'render'
  }
});
