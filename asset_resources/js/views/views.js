var PoiView = Backbone.View.extend({
  template: _.template($('#poi-template').html()),
  className: 'column',

  events: {
    'click .poi-edit'   : 'showModal',
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

  showModal: function() {
    // console.log(this.model);
    var modal = new Modal(this.model);
  },

  clear: function() {
    // this.model.destroy();
  }
});

var Modal = Backbone.View.extend({
  template: _.template($('#modal-template').html()),

  initialize: function(model) {
    this.model = model;
    this.render(this.model);
  },

  events: {
    'click .poi-save' : 'trySave'
  },

  trySave: function() {
    var arr = ['title', 'description', 'lat', 'lng'], data = {};

    _.each(arr, function(el) {
      data[el] = this.$('.poi-'+el).val();
    }, this);

    this.model.save(data);
    this.remove();
  },

  render: function(model) {
    this.$el.append(this.template(this.model.toJSON()));
    this.$('.poi-modal').modal('show');
  }
});

var AppView = Backbone.View.extend({
  el: $('#main'),

  events: {
    'click .show-poi-modal' : 'showModal'
  },

  initialize: function() {
    this.listenTo(Pois, 'add', this.addOne);
    this.listenTo(Pois, 'all', this.render);

    Pois.fetch();
  },

  showModal: function() {
    var modal = new Modal(new Poi());
  },

  addOne: function(poi) {
    var view = new PoiView({model: poi});
    this.$('.poi-list').append(view.render().el);
  }
});
