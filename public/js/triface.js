var triface = function() {
    var rpc = new easyXDM.Rpc({
        remote: "http://api.triface.local/cors/"
    }, {
        remote: {
            request: {}
        }
    });

    var api = {};

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
        History.log(path);
    };

    api.init = function() {
        api.get({url: "/model", success: function(response) {
            _.each(response, function(model) {
                api[model.name] = model;
            });
        }});
    };

    return {
        api: api,
        go: go
    };
}();