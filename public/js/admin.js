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
        var select = function(choice, url) {
            $('#nav li').removeClass('selected');
            $('#nav li.'+choice).addClass('selected');
            triface.go(url);
        };

        return {
            select: select
        };
    }();

    var headerNav = function(modelname) {
        if ($('#header').html() == '') {
            var choices = _.map(triface.models, function(model) {
                return {url: _.template('/<%= name %>', model), title: model.name};
            });
            var nav = template.nav(modelname, choices);
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
                headerNav(params.model);
                if (response.length > 0) {
                    var body = template.table(params.model, _.keys(_.first(response)), response);
                    $('#container').html(body);
                } else {
                    $('#container').html('No items to show');
                }
            }
        });
    };

    var contentNew = function(params, query) {
        // triface.api.get({
        //     url: _.template('/<%= model %>/<%= id %>', params),
        //     success: function(response) {
        //         headerNav(params.model);
        //         var body = template.detail(params.model, _.keys(response), response);
        //         $('#container').html(body);
        //     }
        // });
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



