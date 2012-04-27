_.provide('caribou.Views.Abstract.RowForModelEdit');

caribou.Views.Abstract.RowForModelEdit = Backbone.View.extend({

  tagName: 'tr',

  template: caribou.templates.abstract['row-for-model-edit'],



  initialize: function() {
    _.bindAll(this, 'renderFieldOptions');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var fieldTypes = caribou.modelFieldTypes(),
        field = this.field;

    var output = _.template(this.template, {
      name          : field.name,
      type          : field.type,
      id            : field.id,
      index         : this.index,
      fieldType     : fieldTypes[field.type].name,
      modelPosition : field.model_position
    });


    this.$el.html(output);

    // Render the field options
    _.each(fieldTypes[field.type].options, this.renderFieldOptions);

    return this;
  },



  renderFieldOptions: function(option, i) {

    var key  = _.last(_.parameterize(option).split('-'));

    var output = _.template(caribou.templates.abstract['field-options'][key], {
      index: i
    });

    // This is necessary for the following changes be actually affect the output
    output = $(output);

    switch(key) {
      case 'string':
        $('input[type=text]', output).attr('value', this.field.default_value);
        break;

      case 'boolean':
        var d = this.field.default_value;
        d = d || 'false'; // We have to do this because somteimes its null

        $('option[value=' + d.toLowerCase() + ']', output).attr('selected', 'selected');
        break;

      case 'link':
        $('select', output).html(caribou.admin.slugOptions(this.model, this.field.link));
        break;
    };

    $('.options:first', this.$el).html(output);

  }

});
