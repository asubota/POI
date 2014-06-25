PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'column',

  modelEvents: {
    'change': 'render'
  },

  events: {
    'click .poi-delete-btn' : 'clear',
    'click .poi-edit-btn'   : 'showModal'
  },

  clear: function() {
    this.model.destroy();
  },

  showModal: function() {
    var view = new PoiManager.ModalView({model: this.model, collection: this.model.collection});
    PoiManager.modalRegion.show(view);
    $('.ui.modal').modal('show');
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
});

PoiManager.ModalView = Marionette.ItemView.extend({
  template: '#modal-template',
  className: 'ui modal',
  events: {
    'click .poi-save-btn' : 'trySave',
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
