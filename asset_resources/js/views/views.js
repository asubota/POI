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
    var view = new PoiManager.ModalView({model: this.model});
    PoiManager.modalRegion.show(view);
    $('.ui.modal').modal('show');
  }
});

PoiManager.PoisView = Marionette.CollectionView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui one column grid'
});

PoiManager.ModalView = Marionette.ItemView.extend({
  template: '#modal-template',
  className: 'ui modal',
  events: {
    'click .poi-save-btn'   : 'trySave',
  },

  trySave: function() {
    var arr = ['title', 'description', 'lat', 'lng'], data = {};

    _.each(arr, function(el) {
      data[el] = this.$('.poi-'+el).val();
    }, this);

    this.model.save(data);
  }
});