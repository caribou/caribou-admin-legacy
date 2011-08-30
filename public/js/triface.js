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
            History.log(response.data);
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

    var go = function(path) {
        History.pushState(path, path, path);
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
    var fetchModels = function(success) {
        api.get({
            url: "/model",
            data: {include: "fields"},
            success: function(response) {
                _.each(response, function(model) {
                    models[model.name] = model;
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

    var save = function(name) {
        var data = formData('#'+name+'_form');
        var url = '/' + name;
        var id = name + '[id]';
        if (data[id] && !(data[id] === '')) {url += '/' + data[id];}
        delete data[id];

        api.post({
            url: url,
            data: data,
            success: function(response) {
                History.log(response);
            }
        });
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
        routing: routing,
        save: save,
        formData: formData
    };
}();