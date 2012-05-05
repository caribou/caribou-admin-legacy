// Caribou - 3.0
//
// This version wraps Backbone, adding functionality like:
//   cross-domain requests
//   viewSpecs as first-class citizens
//   built-in associations


(function(_, Backbone) {

  // Secret sauce
  var Caribou = Backbone;


  // Accept viewSpec as a first-class citizen
  //
  // Override the View _configure method
  // The only modification is the addition of viewSpec in viewOptions
  Caribou.View.prototype._configure = function(options) {
    var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'viewSpec'];

    if (this.options) options = _.extend({}, this.options, options);
    for (var i = 0, l = viewOptions.length; i < l; i++) {
      var attr = viewOptions[i];
      if (options[attr]) this[attr] = options[attr];
    }
    this.options = options;
  };



  // Override Sync to allow for Cross-Domain requests
  // TODO



  Caribou.AppRouter = Backbone.Router.extend({

    routes: {
      ''          : 'dashboard',
      'models'    : 'models',
      'models/:id': 'models'
    },


    dashboard: function() {
      console.log('You\'ve reached the Dashboard!');
    },


    models: function(id) {
      console.log('Render models index');
    }

  });



  // Run the app
  var caribou = {};
  caribou.router = new Caribou.AppRouter;

  Caribou.history.start({ pushState: true });


  provide('caribou', caribou);

}).apply(this, [
  require('underscore'),
  require('backbone')
]);


//(function(caribou) {
//  debugger;
//}).apply(this, [require('caribou')]);
