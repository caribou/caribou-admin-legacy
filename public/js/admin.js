interface.admin = function() {
    var template = function() {
        var getTabbedNavigation = function(chosen, choices) {
            return $('#tabbedNavigation').tmpl({chosen: chosen || '', choices: choices, classes: ''});
        };

        var getMainContentForList = function(model, content) {
            return $('#mainContentForList').tmpl({model: model, content: content});
        };

        var getMainContentForEdit = function(model, content) {
            return $('#mainContentForEdit').tmpl({model: model, content: content});
        };
        
        var getMainContentForView = function(model, content) {
            return $('#mainContentForView').tmpl({model: model, content: content});
        };
        
        var getActionItemsForList = function(model, content) {
            return $('#actionItemsForList').tmpl({model: model, content: content});
        };
        
        var getActionItemsForEdit = function(model, content) {
            return $('#actionItemsForEdit').tmpl({model: model, content: content});
        };
        
        var getActionItemsForView = function(model, content) {
            return $('#actionItemsForView').tmpl({model: model, content: content});
        };
        
        var getSidebarForList = function(model, content) {
            return $('#sidebarForList').tmpl({model: model, content: content});
        };

        return {
            getTabbedNavigation: getTabbedNavigation,
            getMainContentForList: getMainContentForList,
            getMainContentForEdit: getMainContentForEdit,
            getMainContentForView: getMainContentForView,
            getActionItemsForList: getActionItemsForList,
            getActionItemsForEdit: getActionItemsForEdit,
            getActionItemsForView: getActionItemsForView,
            getSidebarForList: getSidebarForList
        };
    }();

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
            var navup = template.getTabbedNavigation(modelname, choices);
            $('#tabs').html(navup);
        }

        nav.highlight(modelname);
    };

    var home = function(params, query) {
        headerNav();
        $('#container').html('');
    };

    var contentList = function(params, query) {
        interface.api.get({
            url: _.template('/<%= model %>', params),
            success: function(response) {
                headerNav(params.model);
                var model = interface.models[params.model];
                var action_items = template.getActionItemsForList(model, response.response);
                $('.action_items').html(action_items);
                var sidebar = template.getSidebarForList(model, response.response);
                $('#sidebar').html(sidebar);
                var main_content = template.getMainContentForList(model, response);
                $('#main_content').html(main_content);
            }
        });
    };

    var contentNew = function(params, query) {
        headerNav(params.model);
        var model = interface.models[params.model];
        var main_content = $('#contentDetail').tmpl({
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
                var action_items = template.getActionItemsForEdit(model, response.response);
                $('.action_items').html(action_items);
                var main_content = $('#mainContentForEdit').tmpl({
                    model: model, 
                    content: response.response, 
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
                var action_items = template.getActionItemsForView(model, response.response);
                $('.action_items').html(action_items);
                var body = $('#mainContentForView').tmpl({
                    model: model, 
                    content: response.response, 
                    action: 'update'
                });
                $('#main_content').html(body);
            }
        });
    };

    var contentCreate = function(name) {
        var data = interface.formData('#'+name+'_form');
        var url = '/' + name;

        interface.api.post({
            url: url,
            data: data,
            success: function(response) {
                triface.go(url + '/' + response.response.id);
            }
        });
    };

    var contentUpdate = function(name) {
        var data = interface.formData('#'+name+'_form');
        var id = name + '[id]';
        var url = '/' + name + '/' + data[id];
        delete data[id];

        interface.api.put({
            url: url,
            data: data,
            success: function(response) {
                interface.go(url);
            }
        });
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
        },
        nav: nav,
        create: contentCreate,
        update: contentUpdate,
        delete: contentDelete
    };
}();



