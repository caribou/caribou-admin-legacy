_.provide('caribou.Views.Generic.Table');

caribou.Views.Generic.Table.HeaderColumn = Backbone.View.extend({

  tagName: 'th',


  initialize: function() {
    _.bindAll(this, 'buildClassName');
  },



  render: function() {
    var output,
        options = this.options.data;

    // Add a class and a link if its sortable, otherwise just render the label
    if(options.sortable) {
      output = this.make('a', {
        'class': this.buildClassName(),
        'href' : '#'
      }, options.label);
    } else {
      output = options.label;
    }

    this.$el.html(output);

    return this;
  },



  buildClassName: function() {
    var classNames = [];

    if(this.options.data.slug === this.options.table.viewData.meta.order_by) {
      classNames.push('sorted-' + this.options.table.viewData.meta.order);
      classNames.push(sortable);
      classNames.push(this.options.data.slug);
    }

    return classNames.join(' ');
  }

});
