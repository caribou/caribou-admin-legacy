(function(Backbone, _){

  // Caribou - 3.0
  //
  // This version wraps Backbone, adding functionality like:
  //   cross-domain requests
  //   viewSpecs as first-class citizens
  //   built-in associations


  // Establish the app and namespaces
  var app = {
    views       : {},
    models      : {},
    collections : {}
  };



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




  // Define the remote address for the api
  var LOCATION = window.location.toString(),
      REMOTE = 'http://localhost:33443';
  if (/^https?:\/\/admin/.test(LOCATION))
    REMOTE = LOCATION.replace(/^(https?:\/\/)(admin)(\.[^\/]+).*/, "$1api$3")

  // Override Sync to allow for Cross-Domain requests
  // All of this is the same except where the actual request is made
  // Also removed some of the cruft for older browsers and added some helpers
  Caribou.sync = function(method, model, options) {

    // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
    var methodMap = {
      'create': 'POST',
      'update': 'PUT',
      'delete': 'DELETE',
      'read':   'GET'
    };

    // Helper function to get a value from a Backbone object as a property
    // or as a function.
    var getValue = function(object, prop) {
      if (!(object && object[prop])) return null;
      return _.isFunction(object[prop]) ? object[prop]() : object[prop];
    };

    // Throw an error when a URL is needed, and none is supplied.
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };

    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }


    // Make the request, allowing the user to override any Ajax options.
    // return $.ajax(_.extend(params, options));


    // Override standard ajax call with easyXDM
    var rpc = new easyXDM.Rpc({
      remote: REMOTE+"/cors/"
    }, {
      remote: {
        request: {}
      }
    });

    // easyXDM wants the arguments formatted a little differently,
    // so we have to do some playing around here
    var success = function(response) {
      var data = JSON.parse(response.data),
          statusCode = data.meta.status;

      switch(statusCode) {
        case '200':
          options.success(data);
          break;
        case '403':
          // TODO: Navigate to login page
          break;
      };
    };

    var error = function(response) {
      options.error = options.error || function() {
        console.log.apply(this, arguments);
      }

      options.error(response);
    };

    // easyXDM wants a 'method' rather than a 'type'
    params.method = params.type;

    // Finally, make the actual request
    return rpc.request(params, success, error);


  };


  provide('app', app);
  provide('Caribou', Caribou);


}(
  require('backbone'),
  require('underscore')
));

