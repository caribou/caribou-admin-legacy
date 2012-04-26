_.provide('caribou.Views.Generic');

caribou.Views.Generic.Index = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.index.main,



  initialize: function() {
    _.bindAll(this, 'renderColumnHead', 'renderRow');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var table = this.viewSpec.response.content.main_content.table;
    var output = _.template(this.template, {});

    // Render template
    this.$el.html(output);

    // Render the table header columns
    _.each(table.columns, this.renderColumnHead);

    // Throw another one on the end if we have table actions enabled
    if(table.actions.length)
      $('.index_table thead tr:first', this.$el).append(this.make('th', '&nbsp;'));

    // Render each of the rows
    _.each(this.viewData.response, this.renderRow);

    return this;
  },



  renderColumnHead: function(column) {
    var view = new caribou.Views.Generic.Table.HeaderColumn({
      data: column,
      table: this
    });
    $('.index_table thead tr:first', this.$el).append(view.render().el);
  },



  renderRow: function(row) {
    var view = new caribou.Views.Generic.Table.Row({
      data: row,
      table: this
    });
    $('.index_table tbody', this.$el).append(view.render().el);
  }


});