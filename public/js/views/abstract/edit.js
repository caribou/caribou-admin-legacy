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


      //this.el.addEventListener('DOMNodeInsertedIntoDocument', function() {
      //  new Dragdealer($('.sortable', this.$el)[0], {
      //    horizontal: false,
      //    vertical  : true
      //  });
      //});


      return this;
    },



    renderFieldset: function() {
      var view = new app.views.AbstractFormFieldset({
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
