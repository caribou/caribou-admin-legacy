(function(app, Caribou, _) {

  // Renders the abstract model sidebar
  // Enables user to add fields dynamically

  app.views.AbstractSidebar = Caribou.View.extend({

    id: 'sidebar',



    initialize: function() {
      //_.bindAll(this, 'addField', 'renderPanel', 'renderModelDetails', 'renderEditableFields');
      _.bindAll(this, 'addField', 'renderEditableFields');
    },


    // Currently this contains event bindings for all sidebar 'modules'
    // TODO: may want to update later so that each module has its own view and bindings
    events: {
      'click .type': 'addField'
    },



    render: function() {

      // Remove the default container class of 'without_sidebar'
      $('#active_admin_content').removeClass('without_sidebar');

      this.$el.append(this.renderEditableFields());

      // FIXME: Event bindings aren't working, maybe due to delayed DOM insertion?

      return this;
    },



    //renderPanel: function(values, strategy) {
    //  var panel = _.template(caribou.templates.generic.sidebar[strategy], values);
    //  this.$el.append(panel);

    //  this['render' + _.lazyCapitalize( _.deparameterize(strategy) )]();
    //},




    // --------------------------------------------------------
    // Herein lie the strategies for the various sidebar panels
    // --------------------------------------------------------



    //renderModelDetails: function() {
    //  var _this = this, data = this.panels['model-details'];

    //  // Weeding out the associated fields for now
    //  var attributes = _.filter(this.model.fields, function(field) {
    //    return field.slug !== 'fields';
    //  });

    //  _.each(attributes, function(attribute) {
    //    var attr    = _this.viewData.response[attribute.slug],
    //        content = _.isNull(attr) || _.isUndefined(attr)
    //                    ? _this.make('span', {'class': 'empty'}, 'Empty')
    //                    : attr.toString(),
    //        $tr     = $(_this.make('tr')),
    //        th      = _this.make('th', {}, attribute.name),
    //        td      = _this.make('td', {}, content);

    //    $('.attributes_table table', _this.$el).append($tr.html([th, td]));
    //  });

    //},



    renderEditableFields: function() {
      var make = this.make;

      // First render the panel template
      var $panel = $(_.template(app.templates.abstract.sidebar['editable-fields'])());


      // Then render each of the field types within it
      _.each(app.fieldTypes.attributes, function(attribute) {
        var a, $li = $(make('li'));

        a = make('a', {
          href          : '/',
          'data-type'   : attribute.slug,
          'class'       : 'type'
        }, attribute.name);

        $li.append(a);

        $('.panel_contents ul', $panel).append($li);
      });

      return $panel;

    },





    // -----------------------------------------------------------
    // Event functions (TODO: figure out a better place for these)
    // -----------------------------------------------------------


    addField: function(e) {
      debugger;
      e.preventDefault();

      //var fieldTypes = caribou.modelFieldTypes(),
      //    type = $(e.target).data('type');

      //// FIXME: get rid of the stench of outside references
      //var $modelEditTable = $('.model_fields_edit_table table tbody');

      //var field = new caribou.Views.Abstract.RowForModelEdit({
      //  field: _.extend(fieldTypes[type], { type: type }),
      //  index: $('tr', $modelEditTable).length,
      //  model: this.model
      //});

      //// Render to the DOM
      //$modelEditTable.append(field.render().el);
    }


  });
}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
