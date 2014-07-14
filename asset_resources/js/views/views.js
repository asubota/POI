PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'column',

  modelEvents: {
    'change': 'render'
  },

  events: {
    'click .js-poi-delete-btn' : 'deleteClicked',
    'click .js-poi-info-btn'   : 'showClicked',
    'click .js-poi-edit-btn'   : 'editClicked'
  },

  onRender: function() {
    PoiManager.vent.trigger('map:marker:update', this.model);
  },

  deleteClicked: function() {
    PoiManager.vent.trigger('map:marker:delete', this.model);
    this.model.destroy();
  },

  editClicked: function() {
    this.trigger('poi:edit', this.model);
  },

  showClicked: function() {
    this.trigger('poi:show', this.model);
  }
});

PoiManager.PoisView = Marionette.CompositeView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui grid one column page',
  template: '#template-poi-list',
  childViewContainer: 'div.poi-list-items',

  events: {
    'click .js-poi-new-btn' : 'showModal'
  },

  ui: {
    mapClick: '.ui.slider.checkbox'
  },

  showModal: function(event, model) {
    var modalView = new PoiManager.ModalView({
      model: model || new PoiManager.Poi(),
      collection: this.collection
    });

    PoiManager.modalRegion.show(modalView);
    $('.ui.modal').modal('show');
  },

  onRender: function() {
    this.ui.mapClick.checkbox();
  },

  onChildviewPoiShow: function(childView, model) {
    var detailsView = new PoiManager.DetailsView({model: model});

    PoiManager.detailsRegion.show(detailsView);
    PoiManager.vent.trigger('map:marker:panto', model);
  },

  onChildviewPoiEdit: function(childView, model) {
    this.showModal(null, model);
  },

  initialize: function() {
    var _this = this;

    PoiManager.vent.on('map:poi:add', function(model) {
      _this.showModal(null, model);
    });
  }
});

PoiManager.ModalView = Marionette.ItemView.extend({
  template: '#template-modal',
  className: 'ui modal',
  events: {
    'click .js-poi-save-btn'     : 'trySave',
    'change .js-poi-photo-file'  : 'preview'
  },

  preview: function(e) {
    if (!$(e.target).val()) {
      return;
    }

    var _this = this,
      image = e.target.files[0],
      fd = new FormData();

    fd.append('photo', image);

    $.ajax({
      contentType: false,
      processData: false,
      url: '/upload',
      data: fd,
      type: 'POST',
      success: function(data) {
        var url = data.photo.url;

        _this.$('.poi-photo_path').val(url);
        _this.$('.poi-photo-preview').attr('src', url);
      }
    });
  },

  trySave: function() {
    var arr = ['title', 'description', 'lat', 'lng', 'photo_path', 'time'], data = {};

    _.each(arr, function(selector) {
      data[selector] = this.$('.poi-' + selector).val();
    }, this);

    if (this.model.isNew()){
      this.collection.add(this.model);
    }

    this.model.save(data, {
      success: function(model, data) {
        model.set('photo', data.photo);
      }
    });
  }
});

PoiManager.DetailsView = Marionette.ItemView.extend({
  template: '#template-details',
  className: 'ui piled teal segment',

  modelEvents: {
    'change': 'render',
    'remove': 'clear'
  },

  clear: function() {
    PoiManager.detailsRegion.reset();
  }
});
