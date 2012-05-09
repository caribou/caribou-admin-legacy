(function(app, Caribou, _) {

  // Renders a row for an abstract model attribute
  // TODO: get clarification on what that actually means


  // Make 'app' available within the view so we can grab some of that yummy modelData
  var app = app;

  app.views.AbstractRowForModelEdit = Caribou.View.extend({

    tagName: 'tr',

    template: app.templates.abstract['row-for-model-edit'],



    initialize: function() {
      _.bindAll(this, 'renderFieldOptions', 'deleteField');
    },



    events: {
      'click .delete_link': 'deleteField'
    },



    render: function() {
      //var fieldTypes = caribou.modelFieldTypes(),
      //    field = this.field;
      var field = this.options.field;

      var output = _.template(this.template, {
        name          : field.name                  || '', // Can't let 'undefined' values go in
        type          : field.type                  || '',
        id            : field.id                    || '',
        index         : this.options.index,
        fieldType     : field.type                  || '',
        modelPosition : field.model_position        || '',
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
      _.each(app.fieldTypes.get(field.type).options, this.renderFieldOptions);


      // Set the value for the require checkboxes
      //if(field.required)
      //  $('.options:last input[type=checkbox]', this.$el).attr('checked', true);

      return this;
    },



    renderFieldOptions: function(option, i) {

      var key  = _.last(_.parameterize(option).split('-'));

      var field = _.template(app.templates.abstract['field-options'][key], {
        index: i
      });

      // This is necessary for the following changes be actually affect the output
      var $field = $(field);

      switch(key) {
        case 'string':
          $('input[type=text]', $field).attr('value', this.options.field.default_value);
          break;

        case 'boolean':
          $('option[value=' + this.options.field.default_value + ']', $field).attr('selected', 'selected');
          break;

        case 'link':
          //$('select', $field).html(caribou.admin.slugOptions(this.model, this.options.field.link));
          break;
      };

      $('.options', this.$el).first().append($field);

    },



    // TODO: Refactor this
    deleteField: function(e) {
      e.preventDefault();

      var $tr   = $(e.target).closest('tr'),
          name  = $('input', $tr).attr('name').match(/\[([^\]]+)\]/)[1],
          id    = $('.model_id', $tr).val(),
          // 'removed' refers to the hidden input that tracks the removed fields
          removed = $('#removed_' + name),
          // 'sofar' is just the fields that have already been added to the list
          sofar = removed.val();

      // If our attribute/field is part of the model (wasn't added dynamically)
      // then we want to add it to the removed list for the request
      if(id)
        removed.val(sofar ? [sofar, id].join(',') : id);

      $tr.remove();
    }

  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
