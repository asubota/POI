var Poi = Backbone.Model.extend({
  defaults: function() {
    return {
      title: 'New POI',
      visited:  false
    };
  },

  toggle: function() {
    this.save({visited: !this.get('visited')});
  }
});
