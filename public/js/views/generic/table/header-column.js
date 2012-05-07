(function(app, Caribou, _) {

  app.views.genericTableHeaderColumn = Caribou.View.extend({

    tagName: 'th',


    initialize: function() {
      _.bindAll(this, 'buildClassName');
    },



    render: function() {
      var output, columnName = this.model;

      // Add a class and a link if its sortable, otherwise just render the label
      //if(model.get('sortable')) {
      //  output = this.make('a', {
      //    'class': this.buildClassName(),
      //    'href' : '#'
      //  }, columnName);
      //} else {
        output = columnName;
      //}

      this.$el.append(output);

      return this;
    },



    buildClassName: function() {
      //var classNames = []
      //    model = this.model,
      //    slug = model.get('slug'),
      //    meta = model.collection.meta;

      //if(slug === meta.order_by) {
      //  classNames.push('sorted-' + meta.order);
      //  classNames.push('sortable');
      //  classNames.push(slug);
      //}

      //return classNames.join(' ');
    }

  });
}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
