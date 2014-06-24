var Poi = Backbone.Model.extend({
  defaults: function() {
    return {
      title: 'New POI',
      description: null,
      lat: null,
      lng: null,
      visited: false,
    };
  }
});
