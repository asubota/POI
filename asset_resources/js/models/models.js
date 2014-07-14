var PoiManager = new Backbone.Marionette.Application();

PoiManager.Poi = Backbone.Model.extend({
  defaults: function() {
    return {
      title: 'New POI title',
      description: 'New POI description',
      lat: null,
      lng: null,
      visited: false,
      time: '1h',
      photo: {
        small: {
          url: '/images/pois/small_default.jpg'
        },
        medium: {
          url: '/images/pois/medium_default.jpg'
        },
        full: {
          url: '/images/pois/full_default.jpg'
        }
      }
    };
  },
  urlRoot: '/api/pois'
});
