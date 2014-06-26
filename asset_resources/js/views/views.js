PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'column',

  modelEvents: {
    'change': 'render'
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
    var view = new PoiManager.ModalView({model: this.model, collection: this.model.collection});
    PoiManager.modalRegion.show(view);
    $('.ui.modal').modal('show');
  },

  showDetails: function() {
    var view = new PoiManager.DetailsView({model: this.model});
    PoiManager.detailsRegion.show(view);
  }
});

PoiManager.PoisView = Marionette.CompositeView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui one column grid',
  template: '#template-poi-list',
  childViewContainer: 'div.poi-list-items',

  events: {
    'click .poi-new-btn' : 'showModal'
  },

  showModal: function() {
    var view = new PoiManager.ModalView({model: new PoiManager.Poi(), collection: this.collection});
    PoiManager.modalRegion.show(view);
    $('.ui.modal').modal('show');
  },

  onRender: function() {
    this.collection.each(function(model) {
      var coords = _.map(['lat', 'lng'], function(s) {
          return model.get(s);
        }),
        marker = L.marker(coords).bindPopup(model.get('title'));

      if (_.size(_.compact(coords)) === 2) {
        PoiManager.markers.addLayer(marker);
      }
    });
  }
});

PoiManager.ModalView = Marionette.ItemView.extend({
  template: '#template-modal',
  className: 'ui modal',
  events: {
    'click .poi-save-btn' : 'trySave',
    'change .poi-photo'   : 'tryUpload'
  },

  tryUpload: function(e) {
    var _this = this;
    if (!this.$('.poi-photo').val()) {
      return;
    }
    this.$('form').ajaxSubmit({
      complete: function(xhr, textStatus) {
        var fileUrl = xhr.responseJSON.url;
        _this.$('.poi-photo-preview').attr('src', fileUrl);
      }
    });
  },

  trySave: function() {
    var arr = ['title', 'description', 'lat', 'lng'], data = {};

    _.each(arr, function(el) {
      data[el] = this.$('.poi-'+el).val();
    }, this);

    if (this.model.isNew()){
      this.collection.add( this.model );
    }

    this.model.save(data);
  }
});

PoiManager.DetailsView = Marionette.ItemView.extend({
  template: '#template-details',
  className: 'sss'
});
