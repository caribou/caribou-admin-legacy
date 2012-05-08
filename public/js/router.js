(function(app, Caribou, _) {

  // Application router
  // Handles all routes and delegate side effects of each

  app.Router = Caribou.Router.extend({

    routes: {
      ''           : 'dashboard',
      ':model'     : 'modelIndex',
      ':model/:id' : 'modelShow'
    },


    initialize: function() {

      // Retrieve the model data
      app.modelData = new app.collections.ModelData;

      app.modelData.fetch({
        data: { include: 'fields' },
        success: function(collection) {
          app.mediator.trigger('sync:modelData', collection);
        }
      });

    },



    dashboard: function() {},



    modelIndex: function(modelName) {

      // Fetch data for the specified model if we don't already have it
      if(! app.collections[_.titlecase(modelName)]) {
        app.modelData.add({ slug: _.slugify(modelName) });
      }

      var modelData = new app.collections[_.titlecase(modelName)];

      modelData.fetch({
        success: function(collection) {
          app.mediator.trigger('sync:genericModelData', collection);
        }
      });
    },


    modelShow: function(modelName, id) {
      console.log(modelName, id);

      if(! app.collections[_.titlecase(modelName)]) {
        app.modelData.add({ slug: _.slugify(modelName) });
      }

      // NOTE: This fetches a new model, we could potentially use the one that already exists
      var model = new app.models[_.titlecase(modelName)]({ id: id });
      model.fetch({
        // FIXME: replace with real code
        success: function(model) {
          $('#active_admin_content').empty().append(JSON.stringify(model.attributes))
        }
      });
    }

  });


  // Initialize routing
  app.router = new app.Router;

  // Backbone asks that we wait until the DOM is ready to kick this off
  // http://documentcloud.github.com/backbone/#History-start
  $.domReady(function() {
    Caribou.history.start({ pushState: true });
  });


}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
