var PoiView = Backbone.View.extend({
  template: _.template($('#poi-template').html()),

  events: {
  'click .toggle'   : 'toggleVisited',
  'click a.destroy' : 'clear',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.toggleClass('visited', this.model.get('visited'));

    return this;
  },

  toggleVisited: function() {
    this.model.toggle();
  },

  clear: function() {
    this.model.destroy();
  }
});


var AppView = Backbone.View.extend({
  el: $('#main'),

  events: {
    'click #clear-completed': 'clearCompleted',
  },

  initialize: function() {
    this.listenTo(Pois, 'add', this.addOne);
    this.listenTo(Pois, 'all', this.render);

    Pois.fetch();
  },

  addOne: function(poi) {
    var view = new PoiView({model: poi});
    this.$('.poi-list').append(view.render().el);
  }
});
