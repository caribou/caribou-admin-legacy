(function(app, Caribou, _) {

  // Collection of modelData models
  //
  // Responsible for pulling all model data
  // and creating unique Caribou Models for each

  app.collections.ModelData = Caribou.Collection.extend({


    model: app.models.ModelData,


    url: '/model',


    // Customize the parsing mechanism
    // Example response:
    // {
    //   meta: { status: '200', ... },
    //   response: [ model1, model2, ... ]
    // }
    parse: function(response) {
      this.meta = response.meta;
      return response.response;
    },



    initialize: function() {
      _.bindAll(this, 'buildEachModel', 'buildModel');

      // Build a Caribou Model for each model in the response
      this.on('sync', this.buildEachModel);
      this.on('add', this.buildModel);
    },



    buildEachModel: function() {
      this.each(this.buildModel);
    },



    buildModel: function(model) {
      var slug = model.get('slug'),
          modelName = _.titlecase(slug);

      app.models[modelName] = Caribou.Model.extend({});

      app.collections[modelName] = Caribou.Collection.extend({
        model: app.models[modelName],
        url: '/'+slug,
        parse: function(response) {
          this.meta = response.meta;
          return response.response;
        }
      });
    }


  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
