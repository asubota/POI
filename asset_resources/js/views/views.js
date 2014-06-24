var PoiView = Backbone.View.extend({
  template: _.template($('#poi-template').html()),
  className: 'column',

  events: {
    'click .poi-edit'   : 'edit',
    'click .poi-delete' : 'clear',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));

    return this;
  },

  edit: function() {
    console.log( this.model );

    // $('.poi-modal').modal('show');
  },

  clear: function() {
    // this.model.destroy();
  }
});


var AppView = Backbone.View.extend({
  el: $('#main'),

  events: {
    'click .poi-modal' : 'showModal'
  },

  initialize: function() {
    this.listenTo(Pois, 'add', this.addOne);
    this.listenTo(Pois, 'all', this.render);

    Pois.fetch();
  },

  showModal: function() {
    $('.ui.modal').modal('show');
  },

  addOne: function(poi) {
    var view = new PoiView({model: poi});
    this.$('.poi-list').append(view.render().el);
  }
});
