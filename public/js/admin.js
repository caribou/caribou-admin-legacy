caribou.admin = function() {

  // Private Vars
  
  var _allViewsSpec = {},
      _currentView = "",
      _currentAction = "",
      _currentId = "",
      _currentViewSpec = {};
      _currentViewData = {};
  
  // Public Vars
  
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
  
  
  var slugOptions = function(model, link) {
    var stringFields = _.filter(model.fields, function(field) {
      return field.type === 'string';
    });
    var fieldNames = _.map(stringFields, function(field) {
      return field.name;
    });

    var stringInputs = _.map($('.string_field'), function(string) {
      return $(string).val();
    });
    stringInputs = _.difference(stringInputs, fieldNames);

    var inputOptions = _.map(stringInputs, function(input) {
      return '<option value="'+_.slugify(input)+'">'+_.capitalize(input)+'</option>';
    });

    var fieldOptions = _.map(stringFields, function(field) {
      var select = link && (link.slug === field.slug) ? ' selected="selected"' : '';
      return '<option value="'+field.slug+'"'+select+'>'+field.name+'</option>';
    });

    return fieldOptions.concat(inputOptions);
  };

  var buildSlugOptions = function() {
    var slug_options = _.map($('.string_field'), function(string) {
      return '<option>'+$(string).val()+'</option>';
    }).join('');

    $('.slug_options').html(slug_options);
  };

  /*//////////////////////////////////////////////
  //
  // GETTERS AND SETTERS
  //
  *///////////////////////////////////////////////
  
  var getAllViewsSpec = function(success) {
    caribou.api.get({
      url: "/views/views.index.spec.json",
      data: {},
      success: function(response) {
      	_allViewsSpec = response;
        success && success();
      }
    });
  };
  
  var renderTemplate = function(model, name, env) {
    env.fieldTypes = caribou.modelFieldTypes();
    model = _.capitalize(model);
    var specific = _.template(name, {model: model});
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
      caribou.go(url);
    };

    return {
      highlight: highlight,
      select: select
    };
  }();
  
  var setTabbedNavigation = function(view) {
    if ($('#tabs').html() == '') {
      var choices = _.map(_allViewsSpec.response, parseAllViewsSpec);
      var tabs = template.tabbedNavigation({chosen: view, choices: choices});
      $('#tabs').html(tabs);
    }
    nav.highlight(view);
  };
  
  var parseAllViewsSpec = function(obj) {
  	if(obj.children.length > 0) {
  		var choices = _.map(obj.children, parseAllViewsSpec); 
  	}
  	return {action: "/" + obj.action, slug: obj.slug, label: obj.label, children: choices};
  };
  
  var setBodyClass = function(view, action) {
    $('body').removeClass().addClass('logged_in admin_' + view + ' ' + action);
  };
  
  var setContentClass = function(string) {
    $('#active_admin_content').removeClass().addClass(string);
  };
  
  var setBreadcrumb = function(items) {
    //var breadcrumb = template.breadcrumb({items: items});
    var view = caribou.Views.Tools.Breadcrumbs;

    //$('.breadcrumb').html(view.render(items).el);
    $('.breadcrumb').html('broken for now');
  };
  
  var setPageTitle = function(string) {
    var page_title = template.pageTitle({title: string});
    $('#page_title').html(page_title);
  };
  
  var setFlashNotice = function(string) {
    var flash_notice = template.flashNotice({message: string});
    $('.flashes').html(flash_notice);
  };
  
  var setFlashError = function(string) {
    var flash_error = template.flashError({message: string});
    $('.flashes').html(flash_error);
  };
  
  var setActionItems = function(view, items, label /**optional**/) {
    
    var actionItems = _.map(items, function(item) {
      var view = new caribou.Views.Tools.ActionItem;
      return view.render(item).el;      
    });
    
    // Eventually will just be this:
    //
    // var actionItems = _.map(items, function(item) {
    //   return template['tools/action-item'](item);
    // });
    
    $('.action_items').html(actionItems);
  };
  
  /*//////////////////////////////////////////////
  //
  // VIEW SPECIFIC METHODS EXPOSED THROUGH ROUTES
  //
  *///////////////////////////////////////////////
  
  var contentCreate = function(name) {
    var data = caribou.formData('#'+name+'_edit');
    var url = '/' + name;

    caribou.api.post({
      url: url,
      data: data,
      success: function(response) {
        var succeed = function() {
          caribou.go(url + '/' + response.response.id + '/edit');
        };

        if (name === 'model') {
          caribou.resetModels(succeed);
        } else {
          succeed();
        }
      }
    });

    return false;
  };

  var contentUpdate = function(name, view) {
    debugger;
    var data = caribou.formData('#'+name+'_edit');
    var id = name + '[id]';
    var url = '/' + name + '/' + data[id];
    var redirect = '/' + view + '/' + data[id] + '/edit';
    delete data[id];

    caribou.api.put({
      url: url,
      data: data,
      success: function(response) {
        var succeed = function() {
          caribou.go(redirect);
          setFlashNotice(_.capitalize(name) + ' was successfully updated.');
        };
        if (name === 'model') {
          caribou.resetModels(succeed);
        } else {
          succeed();
        }
      }
    });

    return false;
  };

  var contentDelete = function(name, id) {
    var url = '/' + name + '/' + id;
    caribou.api.delete({
      url: url,
      success: function(response) {
        var succeed = function() {
          $('#'+name+'_'+id).remove();
        };
        if (name === 'model') {
          caribou.resetModels(succeed);
        } else {
          succeed();
        }
      }
    });
  };
  
  fieldDeleteLink = function(e){
    var tr = $(this).parents('tr');
    var name = $(tr).find('input')[0].name.match(/\[([^\]]+)\]/)[1];
    var id = $(tr).find('.model_id').val();
    var removed = $('#removed_'+name);
    var sofar = removed.val();

    if (id) {
      removed.val(sofar ? sofar + ',' + id : id);
    }

    $(tr).remove();
  };
    
  var getModel = function(url, params, query, success) {
    caribou.api.get({
      url: url,
      data: query,
      success: function(response) {
        _currentViewData = response;
      	success && success(params);
      }
    });
  };
  
  var loginView = {
    init: function(params, query) {
      console.log("loginView.init");
    }
  };
  
  var passwordView = {
    new: {
      init: function(params, query) {
        console.log("passwordView.new.init");
      }
    }
  };

  var dashboardView = {
    init: function(params, query) {
      caribou.api.get({
        url: "/views/dashboard.index.spec.json",
        data: query,
        success: function(response) {
        	
        	_currentViewSlug = "dashboard";
        	_currentViewSpec = response;
        	
        	setTabbedNavigation("dashboard");
        	setBodyClass(_currentView, "index");
          setBreadcrumb([{label: "Admin", action: "/"}]);
          setPageTitle(_currentViewSpec.response.title_bar.page_title);
          setActionItems(_currentView, _currentViewSpec.response.title_bar.action_items);
          setContentClass("without_sidebar");
          
        	$('#active_admin_content').html('');

        }
      });
    }
  };
  
  var genericView = {
    
    index: {
      init: function(params, query) {
        _currentView = params.view;
        _currentAction = "index";
        caribou.api.get({
          url: "/views/" + _currentView + "." + _currentAction + ".spec.json",
          data: query,
          success: function(response) {
          	_currentViewSpec = response;
          	var url = "/" + _currentViewSpec.meta.model;
            getModel(url, params, query, genericView.index.draw);

            //$(".datepicker").datepicker({dateFormat: 'yy-mm-dd'});
          }
        });
      },
      draw: function(params) {
        setTabbedNavigation(_currentView);
        setBodyClass(_currentView, _currentAction);
        setBreadcrumb([{label: "Admin", action: "/"}]);
        setPageTitle(_currentViewSpec.response.title_bar.page_title);
        setActionItems(_currentView, _currentViewSpec.response.title_bar.action_items, _currentViewSpec.meta.view.label);
        setContentClass("with_sidebar");
      	//var content = template.contentForGenericIndex({
        //  viewSpec: _currentViewSpec, viewData: _currentViewData});
        var content = new caribou.Views.Generic.Index({
          viewSpec: _currentViewSpec, viewData: _currentViewData});

        $('#active_admin_content').html(content.render().el);
      }
    },

    view: {
      init: function(params, query) {
        _currentView = params.view;
        _currentId = params.id;
        _currentAction = "view";
        caribou.api.get({
          url: "/views/" + _currentView + "." + _currentAction + ".spec.json",
          data: query,
          success: function(response) {
          	_currentViewSpec = response;
          	var url = "/" + _currentViewSpec.meta.model + "/" + _currentId;
            getModel(url, params, query, genericView.view.draw);
          }
        });
      },
      draw: function(params) {
        setTabbedNavigation(_currentView);
        setBodyClass(_currentView, _currentAction);
        setBreadcrumb([{label: "Admin", action: "/"},{label: _currentViewSpec.meta.view.label, action: "/" + _currentViewSpec.meta.view.slug}]);
        setPageTitle(_currentViewData.response[_currentViewSpec.response.title_bar.page_title]);
        setActionItems(_currentView, _currentViewSpec.response.title_bar.action_items);
        setContentClass("with_sidebar");

      	var content = template.contentForGenericView({
          viewSpec: _currentViewSpec, viewData: _currentViewData});
        $('#active_admin_content').html(content);

        // var sidebar = renderTemplate(model.slug, "sidebarFor{{ model }}Edit", {
        //   model: model, 
        //   content: {}, 
        //   action: 'update'
        // });
        // $('#sidebar').html(sidebar);
      }
    },

    edit: {
      init: function(params, query) {
        _currentView = params.view;
        _currentId = params.id;
        _currentAction = "edit";
        caribou.api.get({
          url: "/views/" + _currentView + "." + _currentAction + ".spec.json",
          data: query,
          success: function(response) {
          	_currentViewSpec = response;
          	var url = "/" + _currentViewSpec.meta.model + "/" + _currentId;

            // WARNING: Grabbing all associated objects too
            var associatedFields = _.filter(caribou.models[_currentViewSpec.meta.model].fields, function(field) {
              return field.type === 'collection' });

            query['include'] = _.pluck(associatedFields, 'slug').join(',');

            getModel(url, params, query, genericView.edit.draw);
          }
        });
      },
      draw: function(params) {
        setTabbedNavigation(_currentView);
        setBodyClass(_currentView, _currentAction);
        setBreadcrumb([{label: "Admin", action: "/"},{label: _currentViewSpec.meta.view.label, action: "/" + _currentViewSpec.meta.view.slug},{label: params.id, action: "/" + _currentViewSpec.meta.view.slug + "/" + params.id}]);
        setPageTitle(_currentViewSpec.response.title_bar.page_title);
        setActionItems(_currentView, _currentViewSpec.response.title_bar.action_items);
        setContentClass("with_sidebar");
      	//var content = template.contentForGenericEdit({
        //  viewSpec: _currentViewSpec, viewData: _currentViewData, action: "update"});

        var content = new caribou.Views.Generic.Edit({
          viewSpec: _currentViewSpec,
          viewData: _currentViewData,
          action: 'update'});

        $('#active_admin_content').html(content.render().el);

        // This may want to get moved out to another, more "global" location
        $('.sortable').sortable({
          axis: 'y',
          scroll: true,
          handle: '.handle_link',
          helper: function(e, ui) {
            ui.children().each(function() {
              $(this).width($(this).width());
            });
            return ui;
          },
          stop: function(event, ui) {
            $('.model_position').each(function(index) {
              this.value = index + 1;
            });
          }
        }).disableSelection();
        
      }
    },
    
    new: {
      init: function(params) {
        setTabbedNavigation(params.model);
        var model = caribou.models[_.singularize(params.model)];

        var sidebar = renderTemplate(model.slug, "sidebarFor{{ model }}Edit", {
          model: model, 
          content: {}, 
          action: 'update'
        });
        $('#sidebar').html(sidebar);

        var main_content = renderTemplate(model.slug, "mainContentFor{{ model }}Edit", {
          viewSpec: _currentViewSpec,
          model: model, 
          content: {}, 
          action: 'create'
        });
        $('#main_content').html(main_content);
        
        var upload = caribou.api.upload(function(response) {
          var src = caribou.remoteAPI+'/'+response.url;
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
  
    edit: {
      init: function() {
        
      },
      newField: function(slug, type) {
        var index = $('.model_fields_edit_table table tbody tr').length;
        var field = template['abstractFieldForModelEdit']({model: caribou.models[slug], field: {type: type, model_position: index}, index: index, fieldTypes: caribou.modelFieldTypes()});
        $('.model_fields_edit_table table tbody').append(field);
        $('.delete_link').click(fieldDeleteLink);
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
  
  caribou.routing.add('/login', 'login', loginView.init);
  caribou.routing.add('/password/new', 'new', passwordView.new.init);
  caribou.routing.add('/', 'dashboard', dashboardView.init);
  caribou.routing.add('/:view', 'index', genericView.index.init);
  caribou.routing.add('/:model/new', 'new', genericView.new.init);
  caribou.routing.add('/:view/:id', 'view', genericView.view.init);
  caribou.routing.add('/:view/:id/edit', 'edit', genericView.edit.init);
  
  /*//////////////////////////////////////////////
  //
  // RETURN BLOCK
  //
  *///////////////////////////////////////////////
  
  return {
    init: function() {
      caribou.init();
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
      getAllViewsSpec(caribou.act);
    },
    nav: nav,
    create: contentCreate,
    update: contentUpdate,
    delete: contentDelete,
    genericView: genericView,
    modelView: modelView,
    slugOptions: slugOptions,
    showUploadForm: showUploadForm
  };
  
}();



