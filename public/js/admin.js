triface.admin = function() {
    var template = function() {
        var table = function(modelname, headings, items) {
            return $('#contentTable').tmpl({modelname: modelname, headings: headings, items: items});
        };

        var nav = function(chosen, choices) {
            return $('#contentMenu').tmpl({chosen: chosen || '', choices: choices, classes: ''});
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
                History.log(model);
                var body = template.table(params.model, _.map(model.fields, function(field) {
                    return field.name;
                }), response);
                $('#container').html(body);
            }
        });
    };

    var contentNew = function(params, query) {
        headerNav(params.model);
        var model = triface.models[params.model];
        var body = template.detail(params.model, _.map(model.fields, function(field) {
            return field.name;
        }), {});
        $('#container').html(body);
    };

    var contentDetail = function(params, query) {
        triface.api.get({
            url: _.template('/<%= model %>/<%= id %>', params),
            success: function(response) {
                headerNav(params.model);
                var body = template.detail(params.model, _.keys(response), response);
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



