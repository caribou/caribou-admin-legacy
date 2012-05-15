(function(app, Caribou, _) {

  // Establishes the global navigation for the app

  app.views.GlobalNav = Caribou.View.extend({

    el: '#tabs',


    initialize: function() {
      _.bindAll(this, 'go');
    },


    events: {
      'click li a': 'go'
    },



    render: function() {

      this.$el.removeClass('loading');

      this.collection.each(function(model) {

        // Hide join models
        if(model.get('join_model')) return;


        // Build up the list element with link inside
        var li = this.make('li');

        var a = this.make('a', {
          href: '/' + model.get('slug')
        }, model.get('name'));


        $(li).append(a);

        // Attach to the view
        this.$el.append(li);

      }, this);


      return this;
    },



    go: function(e) {
      e.preventDefault();

      var url = $(e.target).attr('href');

      app.router.navigate(url, { trigger: true });
    }

  });


}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
