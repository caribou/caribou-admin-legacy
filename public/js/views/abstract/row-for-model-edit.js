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
      modelPosition : field.model_position,
      className     : field.type === 'string' ? 'string_field' : ''
    });

    this.$el.html(output);


    // Add the delete button unless the field is locked
    if(! field.locked) {
      $('.actions', this.$el).prepend(this.make('a', {
        href: '#',
        'class': 'member_link delete_link'
      }, 'Delete'));
    }


    // Render the field options
    _.each(fieldTypes[field.type].options, this.renderFieldOptions);

    return this;
  },



  renderFieldOptions: function(option, i) {

    var key  = _.last(_.parameterize(option).split('-'));

    var field = _.template(caribou.templates.abstract['field-options'][key], {
      index: i
    });

    // This is necessary for the following changes be actually affect the output
    var $field = $(field);

    switch(key) {
      case 'string':
        $('input[type=text]', $field).attr('value', this.field.default_value);
        break;

      case 'boolean':
        var d = this.field.default_value;
        d = d || 'false'; // We have to do this because somteimes its null

        $('option[value=' + d.toLowerCase() + ']', $field).attr('selected', 'selected');
        break;

      case 'link':
        $('select', $field).html(caribou.admin.slugOptions(this.model, this.field.link));
        break;
    };

    $('.options:first', this.$el).html($field);

  }

});
