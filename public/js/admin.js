triface.admin = function() {
    var template = function() {
        var table = function(modelname, headings, items) {
            return $('#contentTable').tmpl({modelname: modelname, headings: headings, items: items});
        };

        var nav = function(choices) {
            return $('#contentMenu').tmpl({choices: choices, classes: ''});
        };

        var detail = function(modelname, headings, item) {
            return $('#contentDetail').tmpl({modelname: modelname, headings: headings, item: item});
        };

        return {
            nav: nav,
            table: table,
            detail: detail
        };
    }();

    var headerNav = function() {
        if ($('#header').html() == '') {
            var choices = _.map(triface.models, function(model) {
                return {url: _.template('/<%= name %>', model), title: model.name};
            });
            var nav = template.nav(choices);
            $('#header').html(nav);
        }
    };

    var home = function(params, query) {
        headerNav();
    };

    var contentList = function(params, query) {
        triface.api.get({
            url: _.template('/<%= model %>', params),
            success: function(response) {
                headerNav();
                var body = template.table(params.model, _.keys(_.first(response)), response);
                $('#triface').html(body);
            }
        });
    };

    var contentDetail = function(params, query) {
        triface.api.get({
            url: _.template('/<%= model %>/<%= id %>', params),
            success: function(response) {
                headerNav();
                var body = template.detail(params.model, _.keys(response), response);
                $('#triface').html(body);
            }
        });
    };

    triface.routing.add('/', 'home', home);
    triface.routing.add('/:model', 'contentList', contentList);
    triface.routing.add('/:model/:id', 'contentDetail', contentDetail);

    return {
        init: function() {
            triface.init();
        }
    };
}();



