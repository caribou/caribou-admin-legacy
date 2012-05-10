caribou.admin = function() {
  
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

  var headerNav = function(modelname) {
    if ($('#tabs').html() == '') {
      var choices = _.map(caribou.modelNames, function(modelName) {
        var model = caribou.models[modelName];
        return {url: _.template('/<%= slug %>', model), title: model.name};
      });
      var tabs = template.tabbedNavigation({chosen: modelname, choices: choices});
      $('#tabs').html(tabs);
    }

    nav.highlight(modelname);
  };
  
  var setBodyClass = function(model, action) {
    $('body').removeClass().addClass('logged_in admin_' + model.slug + ' ' + action);
  };
  
  var setBreadcrumb = function(items) {
    var breadcrumb = template.breadcrumb({items: items});
    $('.breadcrumb').html(breadcrumb);
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
    var data = caribou.formData('#'+name+'_edit'),
        url = '/' + name;

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

  var contentUpdate = function(name) {
    var data = caribou.formData('#'+name+'_edit');
    var id = name + '[id]';
    var url = '/' + name + '/' + data[id];
    delete data[id];

    caribou.api.put({
      url: url,
      data: data,
      success: function(response) {
        var succeed = function() {
          caribou.go(url + '/edit');
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

  var dashboardView = {
    init: function() {
      headerNav();
      $('#container').html('');
    }
  };
  
  var loginView = {
    init: function() {
      var login = template.loginForm();
      //History.console(login);
      headerNav();
      $('#wrapper').html(login);
    }
  };

  var genericView = {
    
    list: {
      init: function(params, query) {
        caribou.api.get({
          url: _.template('/<%= model %>', params),
          data: query,
          success: function(response) {
            headerNav(params.model);
            var model = caribou.models[params.model];

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
        var model = caribou.models[params.model];
        var include = _.map(_.filter(model.fields, function(field) {
          return /collection|part|link/.test(field.type);
        }), function(collection) {
          return collection.slug;
        }).join(',');

        var url = _.template('/<%= model %>/<%= id %>', params);

        caribou.api.get({
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

            var sidebar = renderTemplate(model.slug, "sidebarFor<%= model %>View", {
              model: model, 
              content: response.response, 
              meta: response.meta,
              action: 'update'
            });
            $('#sidebar').html(sidebar);

            var main_content = renderTemplate(model.slug, "mainContentFor<%= model %>View", {
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
        var model = caribou.models[params.model];
        var include = _.map(_.filter(model.fields, function(field) {
          return /collection|part|link/.test(field.type);
        }), function(collection) {
          if (model.slug === 'model' && collection.slug === 'fields') {
            return collection.slug + '.link';
          } else {
            return collection.slug;
          }
        }).join(',');

        var url = _.template('/<%= model %>/<%= id %>', params);

        var modelData;

        caribou.api.get({
          url: url,
          data: {include: include},
          success: function(response) {
            modelData = response.response;

            headerNav(params.model);

            setBodyClass(model, 'edit');
            setBreadcrumb([{title: params.model, url: "/" + params.model}, {title: params.id, url: "/" + params.model + "/" + params.id}]);
            setPageTitle("Edit " + model.name);
            setActionItems(model, response.response, response.meta);

            var sidebar = renderTemplate(model.slug, "sidebarFor<%= model %>Edit", {
              model: model, 
              content: modelData, 
              meta: response.meta,
              action: 'update'
            });
            $('#sidebar').html(sidebar);

            var main_content = renderTemplate(model.slug, "mainContentFor<%= model %>Edit", {
              model: model, 
              content: modelData, 
              meta: response.meta,
              action: 'update'
            });
            $('#main_content').html(main_content);

            // Retrieve all instances of parts/collections/links to populated the selects
            // This is less than ideal, so many requests!
            var associatedFields = _.filter(model.fields, function(field) {
              return /collection|link|part/.test(field.type);
            });

            // Build up assocation fields for associated models
            _.each(associatedFields, function(field) {
              modelView.edit.associationFields(field, model, modelData);
            });


            $('.sortable').sortable({
              axis: 'y',
              scroll: true,
              handle: '.handle_link',
              helper: fixHelper,
              stop: function(event, ui) {
                $('.model_position').each(function(index) {
                  this.value = index + 1;
                });
              }
            }).disableSelection();

            $('.delete_link').click(fieldDeleteLink);
            // $('.delete_link').click(function(e){
            //   var tr = $(this).parents('tr');
            //   var name = $(tr).find('input')[0].name.match(/\[([^\]]+)\]/)[1];
            //   var id = $(tr).find('.model_id').val();
            //   var removed = $('#removed_'+name);
            //   var sofar = removed.val();

            //   if (id) {
            //     removed.val(sofar ? sofar + ',' + id : id);
            //   }

            //   $(tr).remove();
            // });

            // buildSlugOptions();

            var upload = caribou.api.upload(function(response) {
              var src = caribou.remoteAPI+'/'+response.url;
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
        var model = caribou.models[params.model];

        var sidebar = renderTemplate(model.slug, "sidebarFor<%= model %>Edit", {
          model: model, 
          content: {}, 
          action: 'update'
        });
        $('#sidebar').html(sidebar);

        var main_content = renderTemplate(model.slug, "mainContentFor<%= model %>Edit", {
          model: model, 
          content: {}, 
          action: 'create'
        });
        $('#main_content').html(main_content);


        // Retrieve all instances of parts/collections/links to populated the selects
        // This is less than ideal, so many requests!
        var associatedFields = _.filter(model.fields, function(field) {
          return /collection|link|part/.test(field.type);
        });

        // Build up assocation fields for associated models
        _.each(associatedFields, function(field) {
          modelView.edit.associationFields(field, model);
        });


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
      newField: function(slug, type) {
        var index = $('.model_fields_edit_table table tbody tr').length;
        var field = template['abstractFieldForModelEdit']({model: caribou.models[slug], field: {type: type, model_position: index}, index: index, fieldTypes: caribou.modelFieldTypes()});
        $('.model_fields_edit_table table tbody').append(field);
        $('.delete_link').click(fieldDeleteLink);
      },

      associationFields: function(field, model, modelData) {

        // Generate a hidden input container for each association, this will be used to manage new instances
        var $parentForm = $('<div />', {
          style : 'display:none',
          id    : [field.slug, 'input', 'container'].join('_'),
          data  : { 'type': field.type }
        }).appendTo( $('#main_content form') );


        // Instantiate our select menu, will build this dynamically
        var $select = $('select', '#' + [model.slug, field.slug, 'input'].join('_'));


        // Make the request for the association to grab all instances
        // so that we can build a useful select menu!
        var url = '/'+field.target().slug;
        caribou.api.get({
          url: url,
          data: { limit: 1000 },
          success: function(resp) {

            // Used to lookup the display text for the instance of a model
            var fieldTargetSlug = field.target().fields[0].slug;


            // Add an option for each model instance
            _.each(resp.response, function(instance) {

              // Grab the value of the firstmost field, this will be used for the display text
              // e.g. "12: Banana"
              var displayTxt = [ instance.id, instance[fieldTargetSlug] ].join(': ');

              // Generate our option
              var $option = $('<option />', { value: instance.id }).text(displayTxt);


              // If the instance is associated to our model
              // Select it (looks at both parts and collections)
              if(modelData) {
                var modelDataField = modelData[field.slug];
                if(_.isArray(modelDataField)) {
                  if(_.indexOf(_.pluck(modelDataField, 'id'), instance.id) > -1)
                    $option.attr('selected', true);
                } else {
                  // If it isn't an array, it must be a single element (or a 'part')
                  if(modelDataField.id == instance.id)
                    $option.attr('selected', true);
                }
              }

              // Append the option to the select
              $select.append($option);
            });


            // Enable the select
            $select.removeAttr('disabled');


            // Build a generic "New Blah Blah" button that we can use in a couple of places
            var newInstanceLink = '<a href="#" class="new_'+ field.slug +'_trigger new_instance_button">Add a new '+ field.target().slug +'</a>: ';


            // Chosen-ify the select menu so we have easy lookups
            $select.chosen({
              // A fun little hack to get google-like instance creation on the fly
              // e.g. <a href="/category/products" class="new_products_trigger">Add a new product</a>: 'Spork'
              no_results_text: newInstanceLink
            })

            .change(function(e) {

              // When a value is removed we have to trash its hidden fields as well so that
              // the association doesn't get created!
              // Gets kinda ugly here, but we want to make sure we have the proper scope
              var $newInstanceFields = $('option[class=new_instance]', e.target),
                  $selectedNewInstanceFields = $newInstanceFields.filter(':selected'),
                  removableFieldsValues = _.map(_.difference(_.toArray($newInstanceFields), _.toArray($selectedNewInstanceFields)), function(el) {
                    return el.innerText;
                  });

              _.each(removableFieldsValues, function(val) {
                var $input = $(':input[value="'+ val +'"]', $parentForm),
                    index  = $input.attr('name').match(/\[\w+\]\[(\d+)\]\[\w+\]/)[1];

                // Remove the hidden inputs
                $(':input[name*='+ index +']', $parentForm).remove();

                // Also remove it from the dropdown
                $('option:contains("'+ val +'")', $select).remove();
              });



              // When we deselect an associated item we have to add it to the remove_$association_name$ input
              // First we need to figure out which ids _aren't_ selected...this requires a little work
              if(modelData) {
                var selectedFieldIds = _.map($('option:selected', e.target), function(opt) {
                      return parseInt(opt.value, 10);
                    }),
                    associatedIds = _.pluck(modelData[field.slug], 'id'),
                    removableIds = _.compact( _.difference(associatedIds, selectedFieldIds) );

                // Next we can take our ids and lump them into a special input
                var $input = $('<input />', {
                  id: 'removed_' + field.slug,
                  type: 'hidden',
                  name: model.slug +'[removed_'+ field.slug +']',
                  value: removableIds.join(',')
                });

                // Finally, add the input we don't already have it
                if(! $('#' + 'removed_' + field.slug).length) $select.after($input);
              }

              $select.trigger('liszt:updated');
            });


            // It's important that we add this data attribute AFTER we add chosen to the select
            // because Chosen will throw away all of our previous datas
            $select.data('associationType', field.slug);


            // Add the "New Blah Blah" button for the less-than-power users
            $(newInstanceLink).html('+').appendTo($select.closest('li'));



            // Handle creation of new instances on the fly
            // This fn builds a modal and manipulates the template
            // overriding default form actions and removing association fields
            var buildModal = function(id) {

              // Get rid of any existing modals
              $('#' + id).remove();

              var $modal = $('<div />', {id: id, 'class':'reveal-modal'});


              // Use our field target helper from before, this way we can populate
              // the appropriate field when the modal appears
              var newViewContent = {};
              newViewContent[fieldTargetSlug] = $(this).siblings('span').text();


              // Grab the form and render it
              var content = renderTemplate(model.slug, "mainContentFor<%= model %>Edit", {
                model: field.target(),
                content: newViewContent,
                action: 'create'
              });


              // Populate the modal with the newly generated content
              $modal.append(content);


              // Remove association fields (the associations will be set automatically)
              _.chain(field.target().fields)
                .filter(function(f) {
                  return /collection|link|part/.test(f.type);
                })
                .each(function(f) {
                  $(':input[name*='+ f.slug +']', $modal).closest('li').remove();
                });


              // Override Cancel button
              $('.cancel a', $modal).click(function(e) {
                e.preventDefault();

                $modal.trigger('reveal:close');
              });


              // Override the Create button
              $('.update', $modal)
                .removeAttr('onclick')
                .click(function(e) {
                  e.preventDefault();

                  // Grab the form values and generate a 'unique-enough' index
                  var formValues = $(this).closest('form').serializeArray(),
                      index = parseInt(new Date().getTime().toString().slice(8), 10);


                  // If its a many to one, we need to clear previous inputs
                  // Also clear out any select options that were the result of a previous instantiation
                  if(field.type === 'part') {
                    $parentForm.empty();
                    $('option[value=""]', $select).remove();
                    $select.trigger('liszt:updated');
                  }


                  // Build up inputs for our parent form from the values we extracted from the modal
                  _.each(formValues, function(obj) {
                    var name = obj.name,
                        value = obj.value,
                        attributeMatch = name.match(/\[(.+)\]$/),
                        inputName = model.slug +'['+ field.slug +']';

                    if(field.type === 'part') {
                      inputName += attributeMatch[0];
                    } else {
                      inputName += ('['+ index +']'+ attributeMatch[0]);
                    }


                    var $input = $('<input />', {
                      type  : 'hidden',
                      name  : inputName,
                      value : value
                    });

                    // Add relevant element to the select menu
                    // NOTE: By default the form will try to grab the innerText of the option tag
                    //   so we have to set an explicitly blank value so that the option is disregarded
                    if(attributeMatch[1] === fieldTargetSlug) {
                      $select.append( $('<option selected value="" class="new_instance">' + value + '</option>') );
                      $select.chosen().trigger('liszt:updated');
                    }


                    // Add the new input to the parent form
                    $parentForm.append($input);

                  });

                  // Finally, close the dialog
                  $modal.trigger('reveal:close')

                });  // end click


              return $modal;

            }; // end buildModal




            // Bind functionality for generating a new model isntance on the fly
            // FIXME: shouldn't use live EVER, but delegate doesn't appear to be working?
            $('.new_'+ field.slug +'_trigger').live('click', function(e) {
              e.preventDefault();

              var id = 'new_'+ field.target().slug;


              // Kill the dropdown, we don't want it interfering with the modal
              if($select.chosen().data().chosen)
                $select.chosen().data().chosen.close_field();

              // Build modal
              var $modal = buildModal.call(this, id);
              $('body').append($modal);

              // Fire it up
              $modal.reveal();
            });

          } // end success

        }); // end caribou.api.get

      } // end associationFields
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
  
  caribou.routing.add('/', 'dashboard', dashboardView.init);
  caribou.routing.add('/login', 'login', loginView.init);
  caribou.routing.add('/:model', 'list', genericView.list.init);
  caribou.routing.add('/:model/new', 'new', genericView.new.init);
  caribou.routing.add('/:model/:id', 'view', genericView.view.init);
  caribou.routing.add('/:model/:id/edit', 'edit', genericView.edit.init);
  
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



