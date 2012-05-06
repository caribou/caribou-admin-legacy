(function(app, Caribou, _) {

  // Establishes the global navigation for the app

  app.views.GlobalNav = Caribou.View.extend({

    el: '#tabs',



    render: function() {

      this.collection.each(function(model) {

        // Build up the list element with link inside
        var li = this.make('li');

        var a = this.make('a', {
          href: '/' + model.get('slug')
        }, model.get('name'));

        // FIXME: what is up with this?
        // Apparently appending a link calls toString
        // which for a link, renders the url
        a.toString = function() { return this };

        $(li).html(a);

        // Attach to the view
        this.$el.append(li);

      }, this);


      return this;
    }

  });


}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
