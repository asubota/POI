var PoiList = Backbone.Collection.extend({
  model: Poi,
  url: '/api/pois',

  visited: function() {
    return this.where({visited: true});
  },
});

var Pois = new PoiList();
