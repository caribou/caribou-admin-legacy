_.provide('caribou.Views.Generic.Table');

caribou.Views.Generic.Table.Row = Backbone.View.extend({

  tagName: 'tr',


  initialize: function() {
    _.bindAll(this, 'renderColumn');


  },



  render: function() {
    // Add the appropriate classes and id
    this.$el.attr('id', this.options.table.viewSpec.meta.view.slug + '_' + this.options.data.id);

    // Then render each column
    _.each(this.options.table.viewSpec.response.content.main_content.table.columns, this.renderColumn);

    // Finally render the appropriate actions
    // TODO

    return this;
  },



  renderColumn: function(column) {
    var view = new caribou.Views.Generic.Table.Column({
      data: column,
      row: this,
      table: this.options.table
    });
    this.$el.append(view.render().el);
  }



});
