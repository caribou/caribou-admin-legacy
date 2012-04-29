_.provide('caribou.Views.Generic');

caribou.Views.Generic.View = Backbone.View.extend({

  className: 'panel',

  template: caribou.templates.generic.view.main,



  initialize: function() {
    _.bindAll(this, 'renderFieldRow');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var fields = this.viewData.response.fields;

    var output = _.template(this.template, {
      fieldsLength: fields.length
    });

    this.$el.html(output);

    // Render each of the table rows
    _.each(fields, this.renderFieldRow);
    return this;
  },



  renderFieldRow: function(field, i) {
    var td = this.make('td'),

        row = this.make('tr', {
          'class': i%2==0 ? 'odd' : 'even'
        },[
          td.text(field.name),
          td.text(field.type)
        ]);

    $('table tbody', this.$el).append(row);
  }



});
