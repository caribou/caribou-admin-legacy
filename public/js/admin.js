interface.admin = function() {
    var template = {};
    var findTemplates = function() {
        var templates = _.map($('script[type="text/x-jquery-tmpl"]'), 
                              function(tmpl) {return tmpl.id;});
        _.each(templates, function(tmpl) {
            template[tmpl] = function(env) {
                return $('#'+tmpl).tmpl(env);
            };
        });
    };

    var nav = function() {
        var highlight = function(choice) {
            $('#tabs li').removeClass('current');
            if (choice) {
                $('#tabs li#'+choice).addClass('current');
                $('#page_title').html(choice);
            }
        };

        var select = function(choice, url) {
            highlight(choice);
            interface.go(url);
        };

        return {
            highlight: highlight,
            select: select
        };
    }();

    var headerNav = function(modelname) {
        if ($('#tabs').html() == '') {
            var choices = _.map(interface.modelNames, function(modelName) {
                var model = interface.models[modelName];
                return {url: _.template('/<%= name %>', model), title: model.name};
            });
            var navup = template.tabbedNavigation({chosen: modelname, choices: choices});
            $('#tabs').html(navup);
        }

        nav.highlight(modelname);
    };

    var home = function(params, query) {
        headerNav();
        $('#container').html('');
    };

    var contentList = function(params, query) {
        console.log(params);
        console.log(query);
        interface.api.get({
            url: _.template('/<%= model %>', params),
            data: query,
            success: function(response) {
                headerNav(params.model);
                var model = interface.models[params.model];
                var action_items = template.actionItemsForList({
                    model: model, content: response.response, meta: response.meta});
                $('.action_items').html(action_items);
                var sidebar = template.sidebarForList({
                    model: model, content: response.response, meta: response.meta});
                $('#sidebar').html(sidebar);
                var main_content = template.mainContentForList({
                    model: model, content: response.response, meta: response.meta});
                $('#main_content').html(main_content);
            }
        });
    };

    var contentNew = function(params, query) {
        headerNav(params.model);
        var model = interface.models[params.model];
        var main_content = template.mainContentForEdit({
            model: model, 
            content: {}, 
            action: 'create'
        });

        $('#main_content').html(main_content);
    };

    var contentEdit = function(params, query) {
        var model = interface.models[params.model];
        var include = _.map(_.filter(model.fields, function(field) {
            return field.type === 'collection';
        }), function(collection) {
            return collection.name;
        }).join(',');

        var url = _.template('/<%= model %>/<%= id %>', params);

        interface.api.get({
            url: url,
            data: {include: include},
            success: function(response) {
                headerNav(params.model);
                var action_items = template.actionItemsForEdit({
                    model: model, content: response.response, meta: response.meta});
                $('.action_items').html(action_items);
                var main_content = template.mainContentForEdit({
                    model: model, 
                    content: response.response, 
                    meta: response.meta,
                    action: 'update'
                });
                $('#main_content').html(main_content);
            }
        });
    };
    
    var contentView = function(params, query) {
        var model = interface.models[params.model];
        var include = _.map(_.filter(model.fields, function(field) {
            return field.type === 'collection';
        }), function(collection) {
            return collection.name;
        }).join(',');

        var url = _.template('/<%= model %>/<%= id %>', params);

        interface.api.get({
            url: url,
            data: {include: include},
            success: function(response) {
                headerNav(params.model);
                var action_items = template.actionItemsForView({
                    model: model, content: response.response, meta: response.meta});
                $('.action_items').html(action_items);
                var body = template.mainContentForView({
                    model: model, 
                    content: response.response, 
                    meta: response.meta,
                    action: 'update'
                });
                $('#main_content').html(body);
            }
        });
    };

    var contentCreate = function(name) {
        var data = interface.formData('#'+name+'_edit');
        var url = '/' + name;

        interface.api.post({
            url: url,
            data: data,
            success: function(response) {
                interface.go(url + '/' + response.response.id + '/edit');
            }
        });

        return false;
    };

    var contentUpdate = function(name) {
        var data = interface.formData('#'+name+'_edit');
        var id = name + '[id]';
        var url = '/' + name + '/' + data[id];
        delete data[id];

        interface.api.put({
            url: url,
            data: data,
            success: function(response) {
                interface.go(url + '/edit');
            }
        });

        return false;
    };

    var contentDelete = function(name, id) {
        var url = '/' + name + '/' + id;
        interface.api.delete({
            url: url,
            success: function(response) {
                $('#'+name+'_'+id).remove();
            }
        });
    };

    interface.routing.add('/', 'home', home);
    interface.routing.add('/:model', 'contentList', contentList);
    interface.routing.add('/:model/new', 'contentNew', contentNew);
    interface.routing.add('/:model/:page', 'contentList', contentList);
    interface.routing.add('/:model/:id/edit', 'contentEdit', contentEdit);
    interface.routing.add('/:model/:id/view', 'contentView', contentView);

    return {
        init: function() {
            interface.init();
            findTemplates();
        },
        nav: nav,
        create: contentCreate,
        update: contentUpdate,
        delete: contentDelete
    };
}();



