_.provide('caribou.Views.Generic.View');

caribou.Views.Generic.View.PanelAttributesTable = Backbone.View.extend({

  className: 'attributes_table',

  template: caribou.templates.generic.view['panel-attributes-table'],



  initialize: function() {
    _.bindAll(this, 'renderTableRow');
    _.reverseExtend(this, this.options);
  },



  render: function() {


    // Update class and id attrs
    this.$el.addClass(this.viewSpec.meta.model);
    this.$el.attr('id', [
      'attributes_table',
      this.viewSpec.meta.model,
      this.viewData.response.id
    ].join('_'));


    // Render the table rows
    _.each(this.object.contents, this.renderTableRow);

    return this;
  },



  renderTableRow: function(field) {
    var tr        = this.make('tr'),

        td        = this.make('td'),

        label     = this.make('label', {
                      'class': 'label'
                    }, field.label),

        emptySpan = this.make('span', {
                      'class': 'empty'
                    }, 'Empty'),

        fieldData = this.viewData.response[field.slug],

        content   = $(td).html(fieldData ? fieldData : emptySpan);


    $('table', this.$el).append( $(tr).html([label, content]) );
  }

});
