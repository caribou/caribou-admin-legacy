triface.admin = function() {
    var template = function() {
        var table = function(items) {
            return $('#contentTable').tmpl({items: items, headings: _.keys(_.first(items))});
        };

        var nav = function(choices) {
            return $('#contentMenu').tmpl({choices: choices, classes: ''});
        };

        return {
            table: table,
            nav: nav
        };
    }();

    var home = function(params) {
        triface.api.get({
            url: '/model',
            success: function(response) {
                var choices = _.map(response, function(model) {
                    return {url: _.template('/<%= name %>', model), title: model.name};
                });
                var body = template.nav(choices);
                $('#triface').html(body);
            }
        });
    };

    var modelList = function(params) {
        triface.api.get({
            url: _.template('/<%= model %>', params),
            success: function(response) {
                var body = template.table(response);
                $('#triface').html(body);
            }
        });
    };

    triface.routing.add('/', 'home', home);
    triface.routing.add('/:model', 'modelList', modelList);

    return {
        init: function() {
            triface.api.init();
            var action = triface.routing.action();
            action();
        }
    };
}();



