_.provide('caribou.Views.Generic.Edit');

caribou.Views.Generic.Edit.Sidebar = Backbone.View.extend({

  id: 'sidebar',

  template: caribou.templates.generic.edit.sidebar,



  initialize: function() {
    _.bindAll(this, 'renderAttributes', 'renderFields', 'addField');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click .type': 'addField'
  },



  render: function() {
    this.fieldTypes = _.memoize(caribou.modelFieldTypes)();

    var output = _.template(this.template, {
      id: ['attributes_table', this.model.slug, this.viewData.response.id].join('_'),
      className: this.model.slug
    });

    this.$el.html(output);


    // Render attributes
    var attributes = _.filter(this.model.fields, function(field) {
      return !field.editable || field.slug === 'position';
    });

    _.each(attributes, this.renderAttributes);


    // Render fields
    _.each(_.keys(this.fieldTypes), this.renderFields);

    return this;
  },



  renderAttributes: function(attribute) {
    var attr = this.viewData.response[attribute.slug],
        content = attr || this.make('span', {'class': 'empty'}, 'Empty'),
        $tr = $(this.make('tr')),
        th = this.make('th', {}, attribute.name),
        td = this.make('td', {}, content);

    $('.attributes_table table', this.$el).append($tr.html([th, td]));
  },



  renderFields: function(type) {
    var div = this.make('div', {
      'data-type': type,
      'class': 'type'
    }, this.fieldTypes[type].name);

    $('#fields_sidebar_section .panel_contents', this.$el).append(div);
  },



  addField: function(e) {
    e.preventDefault();

    var type = $(e.target).data('type');

    // FIXME: get rid of the stench of outside references
    var $modelEditTable = $('.model_fields_edit_table table tbody');

    var field = new caribou.Views.Abstract.RowForModelEdit({
      field: _.extend(this.fieldTypes[type], { type: type }),
      index: $('tr', $modelEditTable).length,
      model: this.model
    });

    // Render to the DOM
    $modelEditTable.append(field.render().el);
  }


});
