_.provide('caribou.Views.Generic.Table');

caribou.Views.Generic.Table.Column = Backbone.View.extend({

  tagName: 'td',


  initialize: function() {
    _.bindAll(this, 'go');
    _.reverseExtend(this, this.options);

  },


  events: {
    'click a': 'go'
  },



  render: function() {
    var output,
        data = this.data,
        rowData = this.row.data;

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
    var path = [this.table.viewSpec.meta.view.slug, this.data.id].join('/');
    caribou.go(path);
  }
});
