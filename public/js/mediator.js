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


  mediator.on('sync:genericModelData', function(modelData) {
    var view = new app.views.GenericModelList({
      collection: modelData
    });

    $('#active_admin_content').empty().append(view.render().el);
  });


}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
