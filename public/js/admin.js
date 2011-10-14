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
    
    var fixHelper = function(e, ui) {
      ui.children().each(function() {
        $(this).width($(this).width());
      });
      return ui;
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
    
    var dashboardView = {
      init: function() {
        headerNav();
        $('#container').html('');
      }
    };
    
    var genericView = {
      
      list: {
        init: function(params, query) {
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
        }
      },
      
      view: {
        init: function(params, query) {
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
        }
      },
      
      edit: {
        init: function(params, query) {
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
              
              $('.sortable').sortable({
                axis: 'y',
                scroll: true,
                handle: '.handle_link',
                helper: fixHelper
              }).disableSelection();

              var upload = interface.api.upload(function(response) {
                  var src = 'http://api.triface.local/'+response.url;
                  $('#'+response.context+'_asset').val(response.asset_id);
                  $('#'+response.context+'_thumbnail').html('<a target="_blank" href="'+src+'"><img src="'+src+'" height="100" /></a>');
                  $('#upload_dialog').dialog("close");
              });
            }
          });
        }
      },
      
      new: {
        init: function(params) {
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
            var src = 'http://api.triface.local/'+response.url;
            $('#'+response.context+'_asset').val(response.asset_id);
            $('#'+response.context+'_thumbnail').append('<a target="_blank" href="'+src+'"><img src="'+src+'" height="100" /></a>');
            $('#upload_dialog').dialog("close");
          });
        }
      },
      
      create: {
        init: function() {
          
        }
      },
      
      update: {
        init: function() {
          
        }
      },
      
      delete: {
        init: function() {
          
        }
      }
      
    };
    
    var modelView = {
      
      list: {
        init: function() {
          
        }
      },
      
      view: {
        init: function() {
          
        }
      },
      
      edit: {
        init: function() {
          
        },
        newField: function() {
          var index = $('.model_fields_edit_table table tbody tr').length;
          var field = template.genericFieldForModelEdit({field: {type: 'string'}, index: index});
          $('.model_fields_edit_table table tbody').append(field);
        }
      }
      
    };
    
    var showUploadForm = function(context) {
        $('#upload_context').val(context);
        $('#upload_dialog').dialog('open');
    };
    
    /*//////////////////////////////////////////////
    //
    // SETUP ROUTING
    //
    *///////////////////////////////////////////////
    
    interface.routing.add('/', 'dashboard', dashboardView.init);
    interface.routing.add('/:model', 'list', genericView.list.init);
    interface.routing.add('/:model/new', 'new', genericView.new.init);
    interface.routing.add('/:model/:id', 'view', genericView.view.init);
    interface.routing.add('/:model/:id/edit', 'edit', genericView.edit.init);
    
    /*//////////////////////////////////////////////
    //
    // RETURN BLOCK
    //
    *///////////////////////////////////////////////
    
    return {
        init: function() {
            interface.init();
            $('#upload_dialog').dialog({
                autoOpen: false,
                modal: true,
                draggable: false,
                resizeable: false,
                width: 640,
                height: 480,
                title: 'File upload'
            });

            findTemplates();
        },
        nav: nav,
        create: contentCreate,
        update: contentUpdate,
        delete: contentDelete,
        genericView: genericView,
        modelView: modelView,
        showUploadForm: showUploadForm
    };
    
}();



