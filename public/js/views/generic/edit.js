(function(app, Caribou, _){

  // Renders the generic model edit form

  app.views.GenericModelEdit = Caribou.View.extend({

    id: 'main_content_wrapper',

    template: app.templates['generic-model'].edit.main,



    initialize: function() {
      _.bindAll(this, 'renderFieldset', 'updateModel');
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


      // Render fieldset
      this.renderFieldset();


      // Render hidden input
      //$('form div:first', this.$el).html(this.make('input', {
      //  type  : 'hidden',
      //  name  : this.viewSpec.meta.model + '[id]',
      //  value : this.viewData.response.id
      //}));


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



    renderFieldset: function() {
      var view = new app.views.GenericFormFieldset({
        model: this.model,
      });

      $('#main_content form', this.$el).prepend(view.render().el);
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
