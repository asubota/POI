PoiManager.PoiCollection = Backbone.Collection.extend({
  model: PoiManager.Poi,
  url: '/api/pois',

  visited: function() {
    return this.where({visited: true});
  },
});
