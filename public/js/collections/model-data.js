(function(app, Caribou, _) {

  // Collection of modelData models
  //
  // Responsible for pulling all model data
  // and creating unique Caribou Models for each

  app.collections.ModelData = Caribou.Collection.extend({

    model: app.models.ModelData,


    url: '/model',


    parse: function(response) {
      this.meta = response.meta;
      return response.response;
    },



    initialize: function() {
      _.bindAll(this, 'buildModelDataModel');
      this.on('reset', this.buildModelDataModel);
    },



    buildModelDataModel: function() {

      this.each(function(model) {
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
      });

    }


  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
