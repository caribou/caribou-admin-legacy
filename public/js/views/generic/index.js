_.provide('caribou.Views.Generic');

caribou.Views.Generic.Index = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.index.main,



  initialize: function() {
    _.bindAll(this, 'renderColumnHead', 'renderRow');

    this.viewSpec = this.options.viewSpec;
    this.viewData = this.options.viewData;
  },



  render: function() {
    // TODO
    // if there is no view data, render blank view
    // render the footer
    // then the sidebar
    // fix sorting links

    var output = _.template(this.template, {});

    this.$el.html(output);

    // Render the table header columns
    _.each(this.viewSpec.response.content.main_content.table.columns, this.renderColumnHead);

    // Throw another one on the end if we have table actions enabled
    if(this.viewSpec.response.content.main_content.table.actions.length)
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
