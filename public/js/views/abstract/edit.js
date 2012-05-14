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


      // Render fieldsets
      // NOTE: A relic from viewSpecs, leave here as a reminder
      //var fieldsets = _.filter(this.viewSpec.response.content.main_content, function(item) {
      //  return item.type === 'fieldset';
      //});
      //_.each(fieldsets, this.renderFieldset);
      this.renderFieldset();


      // Render abstract fields on model
      _.each(model.get('fields'), this.renderAbstractField);


      // Render the sidebar
      var sidebar = new app.views.AbstractSidebar({
        model: model
      });


      // FIXME: This is a little janky right now, but we can't insert
      // an element _after_ another until its actually in the DOM
      var $el = this.$el;
      this.el.addEventListener('DOMNodeInserted', function() {
        $el.after(sidebar.render().el);
      }, false);


      return this;
    },



    renderFieldset: function(fieldset) {
      var view = new app.views.genericFormFieldset({
        model: this.model,
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

      this.model.save();
    }


  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
