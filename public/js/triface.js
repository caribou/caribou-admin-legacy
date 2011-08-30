var triface = function() {
    var rpc = new easyXDM.Rpc({
        remote: "http://api.triface.local/cors/"
    }, {
        remote: {
            request: {}
        }
    });

    var api = {};
    var sherpa = new Sherpa.Router();

    var getPath = function() {
        var state = History.getState().hash.split('?');
        var path = state[0];
        var query = {};

        if (state[1]) {
            var params = state[1].split('&');
            if (params[0] === '') {
                params = params.slice(1);
            }

            query = _.reduce(params, function(args, param) {
                var parts = param.split('=');
                args[parts[0]] = parts[1];
                return args;
            }, {});
        }

        return {path: path, query: query};
    };

    api.request = function(request) {
        var success = request.success || function(response) {};
        var error = request.error || function(response) {History.log(response);};

        rpc.request(request, function(response) {
            success(JSON.parse(response.data));
        }, function(response) {
            error(response);
        });
    };

    api.get = function(request) {
        request.method = 'GET';
        api.request(request);
    };

    api.post = function(request) {
        request.method = 'POST';
        api.request(request);
    };

    api.put = function(request) {
        request.method = 'PUT';
        api.request(request);
    };

    var go = function(path) {
        var state = History.getState();
        var trodden = _.last(state.cleanUrl.match(/http:\/\/[^\/]+(.*)/));

        History.log(path);
        History.log(trodden);

        if (path === trodden) {
            window.location.reload();
        } else {
            History.pushState(path, path, path);
        }
    };

    var routing = {
        actions: {},

        add: function(path, name, action) {
            sherpa.add(path).to(name);
            this.actions[name] = action;
        },

        match: function(path, query) {
            var match = sherpa.recognize(path);
            var action = this.actions[match.destination];
            return function() {
                return action(match.params, query);
            };
        },

        action: function() {
            var match = getPath();
            return this.match(match.path, match.query);
        }
    };

    var models = {};
    var modelNames = [];

    var fetchModels = function(success) {
        api.get({
            url: "/model",
            data: {include: "fields"},
            success: function(response) {
                _.each(response, function(model) {
                    for (var i = 0; i < model.fields.length; i++) {
                        var target_id = model.fields[i].target_id;
                        model.fields[i].target = target_id ? function() {
                            return models[target_id];
                        } : function() {};
                    }

                    models[model.id] = model;
                    models[model.name] = model;
                    modelNames.push(model.name);
                });
                success();
            }
        });
    };

    var act = function() {
        var action = routing.action();
        action();
    };

    var formData = function(selector) {
        var data = {};

        var verbose = $(selector).serializeArray();
        for (var i = 0; i < verbose.length; i++) {
            data[verbose[i].name] = verbose[i].value;
        }

        var checks = $(selector + " input:checkbox");
        for (i = 0; i < checks.length; i++) {
            data[checks[i].name] = checks[i].checked;
        }

        return data;
    };

    var init = function(success) {
        window.onstatechange = act;
        fetchModels(act);
    };

    return {
        init: init,
        api: api,
        go: go,
        act: act,
        models: models,
        modelNames: modelNames,
        routing: routing,
        formData: formData
    };
}();