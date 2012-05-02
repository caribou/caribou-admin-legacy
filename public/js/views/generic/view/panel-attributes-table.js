_.provide('caribou.Views.Generic.View');

caribou.Views.Generic.View.PanelAttributesTable = Backbone.View.extend({

  className: 'attributes_table',

  template: caribou.templates.generic.view['panel-attributes-table'],



  initialize: function() {
    _.bindAll(this, 'renderTableRow');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    // FIXME: This stuff is in a state of confustion
    // Not sure what this view is supposed to display
    // At one time it appeared to rely on the panel
    //   attributes defined in the spec but that
    //   was always empty
    //
    // Considered in a state of flux


    var output = _.template(this.template);
    this.$el.html(output);

    // Update class and id attrs
    this.$el.addClass(this.viewSpec.meta.model);
    this.$el.attr('id', [
      'attributes_table',
      this.viewSpec.meta.model,
      this.viewData.response.id
    ].join('_'));


    // Render the table rows
    _.each(this.object, this.renderTableRow);

    return this;
  },



  renderTableRow: function(field) {
    var tr        = this.make('tr'),

        td        = this.make('td'),

        label     = this.make('td', {
                      'class': 'label'
                    }, field.name),

        emptySpan = this.make('span', {
                      'class': 'empty'
                    }, 'Empty'),

        fieldData = this.viewData.response[field.slug],

        content   = $(td).html(field.type ? field.type : emptySpan);


    $('table', this.$el).append( $(tr).append(label).append(content) );
  }

});
