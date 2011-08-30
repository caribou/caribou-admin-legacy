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
        var body = $('#contentDetail').tmpl({
            model: model, 
            content: {}, 
            action: 'create'
        });

        $('#container').html(body);
    };

    var contentDetail = function(params, query) {
        var model = triface.models[params.model];
        var include = _.map(_.filter(model.fields, function(field) {
            return field.type === 'collection';
        }), function(collection) {
            return collection.name;
        }).join(',');

        var url = _.template('/<%= model %>/<%= id %>', params);

        triface.api.get({
            url: url,
            data: {include: include},
            success: function(response) {
                headerNav(params.model);
                var body = $('#contentDetail').tmpl({
                    model: model, 
                    content: response, 
                    action: 'update'
                });

                $('#container').html(body);
            }
        });
    };

    var contentCreate = function(name) {
        var data = triface.formData('#'+name+'_form');
        var url = '/' + name;

        triface.api.post({
            url: url,
            data: data,
            success: function(response) {
                triface.go(url + '/' + response.id);
            }
        });
    };

    var contentUpdate = function(name) {
        var data = triface.formData('#'+name+'_form');
        var id = name + '[id]';
        var url = '/' + name + '/' + data[id];
        delete data[id];

        triface.api.put({
            url: url,
            data: data,
            success: function(response) {
                var model = triface.models[name];
                var body = $('#contentDetail').tmpl({
                    model: model, 
                    content: response, 
                    action: 'update'
                });

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

        nav: nav,

        create: contentCreate,
        update: contentUpdate
    };
}();



