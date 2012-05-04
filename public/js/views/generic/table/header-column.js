_.provide('caribou.Views.Generic.Table');

caribou.Views.Generic.Table.HeaderColumn = Backbone.View.extend({

  tagName: 'th',


  initialize: function() {
    _.bindAll(this, 'buildClassName');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var output,
        data = this.data;

    // Add a class and a link if its sortable, otherwise just render the label
    if(data.sortable) {
      output = this.make('a', {
        'class': this.buildClassName(),
        'href' : '#'
      }, data.label);
    } else {
      output = data.label;
    }

    this.$el.html(output);

    return this;
  },



  buildClassName: function() {
    var classNames = [];

    if(this.data.slug === this.table.viewData.meta.order_by) {
      classNames.push('sorted-' + this.table.viewData.meta.order);
      classNames.push(sortable);
      classNames.push(this.data.slug);
    }

    return classNames.join(' ');
  }

});
