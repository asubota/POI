PoiManager.PoiCollection = Backbone.Collection.extend({
  model: PoiManager.Poi,
  url: '/api/pois',
  comparator: 'title',

  visited: function() {
    return this.where({visited: true});
  },
});
