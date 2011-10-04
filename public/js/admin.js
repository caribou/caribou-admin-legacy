interface.admin = function() {
    
    /*//////////////////////////////////////////////
    //
    // UTILITES
    //
    *///////////////////////////////////////////////
    
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
    
    /*//////////////////////////////////////////////
    //
    // GETTERS AND SETTERS
    //
    *///////////////////////////////////////////////
    
    var renderTemplate = function(model, name, env) {
        model = _.capitalize(model);
        var specific = _.template(name, {model: model});
        console.log(specific);
        if (template[specific]) {
            return template[specific](env); 
        } else {
            return template[_.template(name, {model: 'Generic'})](env);
        }
    };
    
    var nav = function() {
        var highlight = function(choice) {
            $('#tabs li').removeClass('current');
            if (choice) {
                $('#tabs li#'+choice).addClass('current');
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
            var tabs = template.tabbedNavigation({chosen: modelname, choices: choices});
            $('#tabs').html(tabs);
        }

        nav.highlight(modelname);
    };
    
    var setBodyClass = function(model, action) {
      $('body').removeClass().addClass('logged_in admin_' + model.name + ' ' + action);
    };
    
    var setBreadcrumb = function(items) {
      var breadcrumb = template.breadcrumb({
          items: items});
      $('.breadcrumb').html(breadcrumb);
    };
    
    var setPageTitle = function(string) {
      var page_title = template.pageTitle({
          title: string});
      $('#page_title').html(page_title);
    };
    
    var setFlashNotice = function(string) {
      var flash_notice = template.flashNotice({
          message: string
      });
      $('.flashes').html(flash_notice);
    };
    
    var setFlashError = function(string) {
      var flash_error = template.flashError({
          message: string
      });
      $('.flashes').html(flash_error);
    };
    
    var setActionItems = function(model, content, meta) {
      var action_items = template.actionItemsForGenericEdit({
          model: model, content: content, meta: meta});
      $('.action_items').html(action_items);
    };
    
    var setSidebar = function() {
      
    };
    
    var setMainContent = function() {
      
    };
    
    /*//////////////////////////////////////////////
    //
    // VIEW SPECIFIC METHODS EXPOSED THROUGH ROUTES
    //
    *///////////////////////////////////////////////
    
    var dashboard = function(params, query) {
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
                
                var breadcrumb = template.breadcrumb({
                    model: model, content: response.response, meta: response.meta});
                $('.breadcrumb').html(breadcrumb);
                
                var page_title = template.pageTitle({
                    title: model.name});
                $('#page_title').html(page_title);
                
                var action_items = template.actionItemsForGenericList({
                    model: model, content: response.response, meta: response.meta});
                $('.action_items').html(action_items);
                
                var sidebar = template.sidebarForGenericList({
                    model: model, content: response.response, meta: response.meta});
                $('#sidebar').html(sidebar);
                
                var main_content = template.mainContentForGenericList({
                    model: model, content: response.response, meta: response.meta});
                $('#main_content').html(main_content);
                
                $(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});
            }
        });
    };

    var contentNew = function(params, query) {
        headerNav(params.model);
        var model = interface.models[params.model];

        var sidebar = renderTemplate(model.name, "sidebarFor<%= model %>Edit", {
            model: model, 
            content: {}, 
            action: 'update'
        });
        $('#sidebar').html(sidebar);
        
        var main_content = renderTemplate(model.name, "mainContentFor<%= model %>Edit", {
            model: model, 
            content: {}, 
            action: 'create'
        });
        $('#main_content').html(main_content);

        var upload = interface.api.upload(function(response) {
            alert(response);
        });
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
                
                setBodyClass(model, 'edit');
                setBreadcrumb([{title: params.model, url: "/" + params.model}, {title: params.id, url: "/" + params.model + "/" + params.id}]);
                setPageTitle("Edit " + model.name);
                setActionItems(model, response.response, response.meta);
                
                var sidebar = renderTemplate(model.name, "sidebarFor<%= model %>Edit", {
                  model: model, 
                  content: response.response, 
                  meta: response.meta,
                  action: 'update'
                });
                $('#sidebar').html(sidebar);
                
                var main_content = renderTemplate(model.name, "mainContentFor<%= model %>Edit", {
                  model: model, 
                  content: response.response, 
                  meta: response.meta,
                  action: 'update'
                });
                $('#main_content').html(main_content);

                // $('#main_content').fileupload({
                //     datatype: 'json',
                //     url: '/upload',
                //     done: function(e, data) {
                //         console.log(e);
                //         console.log(data);
                //     }
                // });

                // // FILE UPLOAD
                // $('#main_content').fileupload();
                // $.getJSON($('#main_content form').prop('action'), function (files) {
                //     var fu = $('#main_content').data('fileupload');
                //     fu._adjustMaxNumberOfFiles(-files.length);
                //     fu._renderDownload(files)
                //         .appendTo($('#main_content .files'))
                //         .fadeIn(function () {
                //             $(this).show();
                //         });
                // });
                // $('#main_content .files a:not([target^=_blank])').live('click', function (e) {
                //     e.preventDefault();
                //     $('<iframe style="display:none;"></iframe>')
                //         .prop('src', this.href)
                //         .appendTo('body');
                // });
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
                
                var breadcrumb = template.breadcrumb({
                    items: [{title: params.model, url: "/" + params.model}, {title: params.id, url: "/" + params.model + "/" + params.id}]});
                $('.breadcrumb').html(breadcrumb);
                
                var page_title = template.pageTitle({
                    title: "View " + model.name});
                $('#page_title').html(page_title);
                
                var action_items = template.actionItemsForGenericView({
                    model: model, content: response.response, meta: response.meta});
                $('.action_items').html(action_items);
                
                var sidebar = renderTemplate(model.name, "sidebarFor<%= model %>View", {
                  model: model, 
                  content: response.response, 
                  meta: response.meta,
                  action: 'update'
                });
                $('#sidebar').html(sidebar);
                
                var main_content = renderTemplate(model.name, "mainContentFor<%= model %>View", {
                  model: model, 
                  content: response.response, 
                  meta: response.meta,
                  action: 'update'
                });
                $('#main_content').html(main_content);
                
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
                var succeed = function() {
                    interface.go(url + '/' + response.response.id + '/edit');
                };

                if (name === 'model') {
                    interface.resetModels(succeed);
                } else {
                    succeed();
                }
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
                var succeed = function() {
                    interface.go(url + '/edit');
                    setFlashNotice(_.capitalize(name) + ' was successfully updated.');
                };

                if (name === 'model') {
                    interface.resetModels(succeed);
                } else {
                    succeed();
                }
            }
        });

        return false;
    };

    var contentDelete = function(name, id) {
        var url = '/' + name + '/' + id;
        interface.api.delete({
            url: url,
            success: function(response) {
                var succeed = function() {
                    $('#'+name+'_'+id).remove();
                };

                if (name === 'model') {
                    interface.resetModels(succeed);
                } else {
                    succeed();
                }
            }
        });
    };
    
    var modelEdit = function() {
        var newModelField = function() {
            var index = $('.model_fields_edit_table table tbody tr').length;
            var field = template.genericFieldForModelEdit({field: {type: 'string'}, index: index});
            $('.model_fields_edit_table table tbody').append(field);
        };

        return {
            newModelField: newModelField
        };
    }();

    var showUploadForm = function() {
        $('#upload_dialog').dialog('open');
    }

    /*//////////////////////////////////////////////
    //
    // SETUP ROUTING
    //
    *///////////////////////////////////////////////
    
    interface.routing.add('/', 'dashboard', dashboard);
    interface.routing.add('/:model', 'contentList', contentList);
    interface.routing.add('/:model/new', 'contentNew', contentNew);
    interface.routing.add('/:model/:id', 'contentView', contentView);
    interface.routing.add('/:model/:id/edit', 'contentEdit', contentEdit);
    
    /*//////////////////////////////////////////////
    //
    // RETURN BLOCK
    //
    *///////////////////////////////////////////////
    
    return {
        init: function() {
            interface.init();
            $('#upload_dialog').dialog({
                autoOpen: false
            });
            findTemplates();
        },
        nav: nav,
        create: contentCreate,
        update: contentUpdate,
        delete: contentDelete,
        showUploadForm: showUploadForm,
        modelEdit: modelEdit
    };
    
}();



