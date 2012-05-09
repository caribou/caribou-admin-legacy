(function(app, Caribou, _){

  // Renders the abstract model edit form

  app.views.AbstractModelEdit = Caribou.View.extend({

    id: 'main_content_wrapper',

    template: app.templates.abstract.edit.main,



    initialize: function() {
      _.bindAll(this, 'renderFieldset', 'renderAbstractField', 'updateModel');
    },



    events: {
      'click .commit a': 'updateModel'
    },



    render: function() {
      var model = this.model;


      var output = _.template(this.template, {
        action: this.action,
        modelType : 'DEFINE ME',//this.model.meta.type,
        label : 'DEFINE ME'//this.viewSpec.meta.view.label
      });


      // Render template
      this.$el.html(output);

      // FIXME
      // this references a model edit
      // I still NEED a model instance edit view
      // FIXME


      // Render fieldsets
      //var fieldsets = _.filter(this.viewSpec.response.content.main_content, function(item) {
      //  return item.type === 'fieldset';
      //});
      //_.each(fieldsets, this.renderFieldset);


      // Render hidden input
      //$('form div:first', this.$el).html(this.make('input', {
      //  type  : 'hidden',
      //  name  : this.viewSpec.meta.model + '[id]',
      //  value : this.viewData.response.id
      //}));


      // Render abstract fields on model
      _.each(model.get('fields'), this.renderAbstractField);


      // Render the sidebar
      //var sidebar = new caribou.Views.Generic.Sidebar({
      //  viewSpec: this.viewSpec,
      //  viewData: this.viewData,
      //  panels: {
      //    'model-details': {
      //      id: ['attributes_table', this.viewSpec.meta.view.slug, this.viewData.response.id].join('_'),
      //      className: this.viewSpec.meta.view.slug
      //    },
      //    'editable-fields': {}
      //  }
      //});


      // FIXME: This is a little janky right now, but we can't insert
      // an element _after_ another until its actually in the DOM
      //var $el = this.$el;
      //this.el.addEventListener('DOMNodeInserted', _.once(function() {
      //  $el.after(sidebar.render().el);
      //}), false);


      return this;
    },



    renderFieldset: function(fieldset) {
      var view = new caribou.Views.Generic.Form.Fieldset({
        fields: this.model.fields,
        viewSpec: this.viewSpec,
        viewData: this.viewData
      });

      $('#main_content form', this.$el).prepend(view.render().el);
    },



    renderAbstractField: function(field, i) {
      var view = new app.views.AbstractRowForModelEdit({
        field: field,
        index: i,
        model: this.model
      });

      $('.model_fields_edit_table table tbody', this.$el).append(view.render().el);
    },



    updateModel: function(e) {
      e.preventDefault();
      caribou.admin.update(this.viewSpec.meta.model, this.viewSpec.meta.view.slug);
    }


  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
