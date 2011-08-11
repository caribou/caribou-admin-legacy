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

    api.request = function(request) {
        var success = request.success || function(response) {};
        var error = request.error || function(response) {console.log(response);};

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

    var go = function(path) {
        History.pushState(path, path, path);
    };

    var routing = {
        actions: {},

        add: function(path, name, action) {
            sherpa.add(path).to(name);
            this.actions[name] = action;
        },

        match: function(path) {
            var match = sherpa.recognize(path);
            var action = this.actions[match.destination];
            return function() {
                return action(match.params);
            };
        },

        action: function() {
            return this.match(History.getState().hash);
        }
    };

    api.init = function() {
        api.get({url: "/model", success: function(response) {
            _.each(response, function(model) {
                api[model.name] = model;
            });
        }});

        window.onstatechange = function(e) {
            var action = routing.action();
            action();
        };
    };

    return {
        api: api,
        go: go,
        routing: routing
    };
}();