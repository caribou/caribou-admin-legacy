_.provide('caribou.Views.Generic');


caribou.Views.Generic.New = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.edit.main,



  initialize: function() {
    _.bindAll(this, 'renderFieldset', 'renderAbstractField', 'createModel');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click .commit a': 'createModel'
  },



  render: function() {
    this.model = caribou.models[this.viewData.meta.type];


    var output = _.template(this.template, {
      action: this.action,
      model : this.viewSpec.meta.model,
      label : this.viewSpec.meta.view.label
    });


    // Render template
    this.$el.html(output);


    // Render fieldsets
    var fieldsets = _.filter(this.viewSpec.response.content.main_content, function(item) {
      return item.type === 'fieldset';
    });
    _.each(fieldsets, this.renderFieldset);


    // Render abstract fields on model
    var abstractFields = this.viewData.response.fields;
    _.each(abstractFields, this.renderAbstractField);


    // Render the sidebar
    var sidebar = new caribou.Views.Generic.Sidebar({
      viewSpec: this.viewSpec,
      viewData: this.viewData,
      panels: {
        'model-details': {
          id: ['attributes_table', this.viewSpec.meta.view.slug, this.viewData.response.id].join('_'),
          className: this.viewSpec.meta.view.slug
        },
        'editable-fields': {}
      }
    });


    // FIXME: This is a little janky right now, but we can't insert
    // an element _after_ another until its actually in the DOM
    var $el = this.$el;
    this.el.addEventListener('DOMNodeInserted', _.once(function() {
      $el.after(sidebar.render().el);
    }), false);


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
    var view = new caribou.Views.Abstract.RowForModelEdit({
      field: field,
      index: i,
      model: this.model
    });

    $('.model_fields_edit_table table tbody', this.$el).append(view.render().el);
  },


  createModel: function(e) {
    e.preventDefault();

    caribou.admin.create(this.viewSpec.meta.model);
  }

});
