_.provide('caribou.Views.Generic.Table');

caribou.Views.Generic.Table.Column = Backbone.View.extend({

  tagName: 'td',


  events: {
    'click a': 'go'
  },



  render: function() {
    var output,
        data = this.options.data,
        rowData = this.options.row.options.data;

    // Depending on the column type, we will render either plain text or a link
    if(data.format === 'link') {
      output = this.make('a', {'href': '#'}, rowData[data.slug]);
    } else {
      output = rowData[data.slug];
    }

    this.$el.html(output);

    return this;
  },



  go: function(e) {
    e.preventDefault();
    var path = [this.options.table.viewSpec.meta.view.slug, this.options.data.id].join('/');
    caribou.go(path);
  }
});
