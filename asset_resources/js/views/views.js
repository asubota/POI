var PoiView = Backbone.View.extend({
  template: _.template($('#poi-template').html()),
  className: 'column',

  events: {
    'click .poi-delete' : 'clear',
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

  clear: function() {
    console.log('poi-delete');
    this.model.destroy();
  }
});


var AppView = Backbone.View.extend({
  el: $('#main'),

  events: {

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
