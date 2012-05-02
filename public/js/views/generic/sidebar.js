_.provide('caribou.Views.Generic');

caribou.Views.Generic.Sidebar = Backbone.View.extend({

  id: 'sidebar',



  initialize: function() {
    _.bindAll(this, 'addField', 'renderPanel', 'renderModelDetails', 'renderEditableFields');
    _.reverseExtend(this, this.options);
  },



  // Currently this contains event bindings for all sidebar 'modules'
  // TODO: may want to update later so that each module has its own view and bindings
  events: {
    'click .type': 'addField'
  },



  render: function() {
    this.model = caribou.models[this.viewData.meta.type];

    // Render each of the panels
    _.each(this.panels, this.renderPanel);


    return this;
  },



  renderPanel: function(values, strategy) {
    var panel = _.template(caribou.templates.generic.sidebar[strategy], values);
    this.$el.append(panel);

    this['render' + _.lazyCapitalize( _.deparameterize(strategy) )]();
  },




  // --------------------------------------------------------
  // Herein lie the strategies for the various sidebar panels
  // --------------------------------------------------------



  renderModelDetails: function() {
    var _this = this, data = this.panels['model-details'];

    // Weeding out the associated fields for now
    var attributes = _.filter(this.model.fields, function(field) {
      return field.slug !== 'fields';
    });

    _.each(attributes, function(attribute) {
      var attr    = _this.viewData.response[attribute.slug],
          content = _.isNull(attr)
                      ? _this.make('span', {'class': 'empty'}, 'Empty')
                      : attr.toString(),
          $tr     = $(_this.make('tr')),
          th      = _this.make('th', {}, attribute.name),
          td      = _this.make('td', {}, content);

      $('.attributes_table table', _this.$el).append($tr.html([th, td]));
    });

  },



  renderEditableFields: function() {
    var _this = this;

    var fieldTypes = _.memoize(caribou.modelFieldTypes)();

    _.each(_.keys(fieldTypes), function(type) {
      var div = _this.make('div', {
        'data-type': type,
        'class': 'type'
      }, fieldTypes[type].name);

      $('#fields_sidebar_section .panel_contents', _this.$el).append(div);
    });

  },





  // -----------------------------------------------------------
  // Event functions (TODO: figure out a better place for these)
  // -----------------------------------------------------------


  addField: function(e) {
    e.preventDefault();

    var fieldTypes = caribou.modelFieldTypes(),
        type = $(e.target).data('type');

    // FIXME: get rid of the stench of outside references
    var $modelEditTable = $('.model_fields_edit_table table tbody');

    var field = new caribou.Views.Abstract.RowForModelEdit({
      field: _.extend(fieldTypes[type], { type: type }),
      index: $('tr', $modelEditTable).length,
      model: this.model
    });

    // Render to the DOM
    $modelEditTable.append(field.render().el);
  }


});
