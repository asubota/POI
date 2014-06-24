var Poi = Backbone.Model.extend({
  defaults: function() {
    return {
      title: 'New POI',
      visited:  false
    };
  }
});
