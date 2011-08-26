triface.admin = function() {
    var template = function() {
        var nav = function(chosen, choices) {
            return $('#contentMenu').tmpl({chosen: chosen || '', choices: choices, classes: ''});
        };

        var table = function(model, items) {
            return $('#contentTable').tmpl({model: model, items: items});
        };

        var detail = function(model, content) {
            return $('#contentDetail').tmpl({model: model, content: content});
        };

        return {
            nav: nav,
            table: table,
            detail: detail
        };
    }();

    var nav = function() {
        var highlight = function(choice) {
            $('#nav li').removeClass('selected');
            if (choice) {
                $('#nav li.'+choice).addClass('selected');
            }
        };

        var select = function(choice, url) {
            highlight(choice);
            triface.go(url);
        };

        return {
            highlight: highlight,
            select: select
        };
    }();

    var headerNav = function(modelname) {
        if ($('#header').html() == '') {
            var choices = _.map(triface.models, function(model) {
                return {url: _.template('/<%= name %>', model), title: model.name};
            });
            var navup = template.nav(modelname, choices);
            $('#header').html(navup);
        }

        nav.highlight(modelname);
    };

    var home = function(params, query) {
        headerNav();
        $('#container').html('');
    };

    var contentList = function(params, query) {
        triface.api.get({
            url: _.template('/<%= model %>', params),
            success: function(response) {
                headerNav(params.model);
                var model = triface.models[params.model];
                var body = template.table(model, response);
                $('#container').html(body);
            }
        });
    };

    var contentNew = function(params, query) {
        headerNav(params.model);
        var model = triface.models[params.model];
        var body = template.detail(model, {});
        $('#container').html(body);
    };

    var contentDetail = function(params, query) {
        triface.api.get({
            url: _.template('/<%= model %>/<%= id %>', params),
            success: function(response) {
                headerNav(params.model);
                var model = triface.models[params.model];
                var body = template.detail(model, response);
                $('#container').html(body);
            }
        });
    };

    triface.routing.add('/', 'home', home);
    triface.routing.add('/:model', 'contentList', contentList);
    triface.routing.add('/:model/new', 'contentNew', contentNew);
    triface.routing.add('/:model/:id', 'contentDetail', contentDetail);

    return {
        init: function() {
            triface.init();
        },

        nav: nav
    };
}();



