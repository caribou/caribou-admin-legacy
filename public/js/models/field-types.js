(function(app, Caribou) {

  // Tracks the field types and their properties

  app.models.FieldTypes = Caribou.Model.extend({

    url: "/type-specs.json",

    parse: function(response) {
      this.meta = response.meta;
      return response.response;
    }

  });

}(
  require('app'),
  require('Caribou')
));
