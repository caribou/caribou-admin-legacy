(function(app, Caribou, _) {

  // Mediates all the action
  // This is the central hub for communication between modules

  // NOTE: Keep an eye on this file, it could get out of hand!

  var mediator = app.mediator = {};

  _.extend(mediator, Caribou.Events);



  mediator.on('sync:modelData', function(modelData) {
    new app.views.GlobalNav({
      collection: modelData
    }).render();
  });


}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
