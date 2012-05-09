(function(app, Caribou, _) {

  // Mediates all the action
  // This is the central hub for communication between modules

  // Mediator has a queue property that allows us to stack up events
  //   it waits until sync:modelData is fired before kicking them off
  //   this might be a terrible idea
  //   should figure out a way to remove the boilerplate an automatically queue
  //   the functions as defined

  // NOTE: Keep an eye on this file, it could get out of hand!

  var mediator = app.mediator = {
    queue: []
  };

  _.extend(mediator, Caribou.Events);



  mediator.on('sync:modelData', function(modelData) {
    new app.views.GlobalNav({
      collection: modelData
    }).render();

    app.synced = true;

    while(mediator.queue.length)
      mediator.queue.shift()();
  });



  mediator.on('sync:genericModelData', function(modelData) {
    var fn = function() {
      var view = new app.views.GenericModelList({
        collection: modelData
      });

      $('#active_admin_content').empty().append(view.render().el);
    };

    if(app.synced) return fn();

    mediator.queue.push(fn);
  });



  mediator.on('sync:modelEdit', function(model) {
    var fn = function() {

      var viewType = model.meta.type === 'model' ? 'AbstractModelEdit' : 'GenericModelEdit',

          view = new app.views[viewType]({
            model: model
          });

      $('#active_admin_content').empty().append(view.render().el);
    };

    if(app.synced) return fn();

    mediator.queue.push(fn);
  });


}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
