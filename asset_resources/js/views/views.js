PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'column',

  events: {
    'click .poi-delete-btn' : 'clear',
  },

  clear: function() {
    this.model.destroy();
  }
});

PoiManager.PoisView = Marionette.CollectionView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui one column grid'
});
