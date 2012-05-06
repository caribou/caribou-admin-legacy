(function(app, Caribou) {

  // Application router
  // Handles all routes and delegate side effects of each

  app.Router = Caribou.Router.extend({

    routes: {
      ''           : 'dashboard',
      ':model'     : 'modelIndex',
      ':model/:id' : 'modelShow'
    },


    dashboard: function() {

      // Retrieve the model data
      var modelData = new app.collections.ModelData;

      modelData.fetch({
        success: function(collection) {
          app.mediator.trigger('sync:modelData', collection);
        }
      });


    },


    modelIndex: function(modelName) {
      console.log(modelName);
    },


    modelShow: function(modelName, id) {
      console.log(modelName, id);
    }

  });


  // Initialize routing
  new app.Router;

  // Backbone asks that we wait until the DOM is ready to kick this off
  // http://documentcloud.github.com/backbone/#History-start
  $.domReady(function() {
    Caribou.history.start({ pushState: true });
  });


  // Export our globals
  provide('router', app.Router);


}(
  require('app'),
  require('Caribou')
));
