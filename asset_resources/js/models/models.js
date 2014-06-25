var PoiManager = new Marionette.Application();

PoiManager.Poi = Backbone.Model.extend({
  defaults: function() {
    return {
      title: 'New POI title',
      description: 'New POI description',
      lat: null,
      lng: null,
      visited: false,
      photo: null
    };
  },
  urlRoot: '/api/pois'
});
