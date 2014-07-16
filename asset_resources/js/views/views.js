PoiManager.PoiItemView = Marionette.ItemView.extend({
  template: '#template-poi-item',
  className: 'item',

  modelEvents: {
    'change': 'render'
  },

  events: {
    'click'                    : 'showClicked',
    'click .js-poi-delete-btn' : 'deleteClicked',
    'click .js-poi-edit-btn'   : 'editClicked'
  },

  onRender: function() {
    PoiManager.vent.trigger('map:marker:update', this.model);
  },

  deleteClicked: function(event) {
    event.stopPropagation();
    PoiManager.vent.trigger('map:marker:delete', this.model);
    this.model.destroy();
  },

  editClicked: function(event) {
    event.stopPropagation();
    this.trigger('poi:edit', this.model);
  },

  showClicked: function() {
    this.trigger('poi:show', this.model);
  }
});

PoiManager.PoisView = Marionette.CompositeView.extend({
  childView: PoiManager.PoiItemView,
  className: 'ui grid one column',
  template: '#template-poi-list',
  childViewContainer: '.poi-items',

  events: {
    'click .js-poi-new-btn' : 'showModal'
  },

  ui: {
    mapClick:   '.js-poi-add-on-map',
    mapCluster: '.js-poi-cluster'
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
    var options = _.object(_.map(['cluster', 'dblclick'], function(type) {
      return [type, {
        onEnable: function() {
          PoiManager.vent.trigger(['map:option', type].join(':'), true);
        },
        onDisable: function() {
          PoiManager.vent.trigger(['map:option', type].join(':'), false);
        }
      }];
    }));

    this.ui.mapClick.checkbox(options.dblclick);
    this.ui.mapCluster.checkbox('enable').checkbox(options.cluster);
  },

  _showDetails: function(model) {
    var detailsView = new PoiManager.DetailsView({model: model});

    PoiManager.detailsRegion.show(detailsView);
    PoiManager.vent.trigger('map:marker:panto', model);
  },

  onChildviewPoiShow: function(childView, model) {
    this._showDetails(model);
  },

  onChildviewPoiEdit: function(childView, model) {
    this.showModal(null, model);
  },

  initialize: function() {
    var _this = this;

    PoiManager.vent.on('map:marker:new', function(geo) {
      _this.showModal(null, new PoiManager.Poi(geo));
    });

    PoiManager.vent.on('map:marker:click', function(model) {
      _this._showDetails(model);
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

  ui: {
    update: '#js-update-lat-lng'
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

        if (_this.model.isNew() || _this.ui.update.prop('checked')) {
          _this.$('.poi-lat').val(data.lat);
          _this.$('.poi-lng').val(data.lng);
        }

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

    this.model.save(data, {wait: true});
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
