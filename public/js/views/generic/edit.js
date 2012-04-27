_.provide('caribou.Views.Generic');

caribou.Views.Generic.Edit = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.edit.main,



  initialize: function() {
    _.bindAll(this, 'renderFieldset', 'renderAbstractField', 'updateModel');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click .commit a': 'updateModel'
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

    // Render hidden input
    if(this.action === 'update') {
      $('form div:first', this.$el).html(this.make('input', {
        type  : 'hidden',
        name  : this.viewSpec.meta.model + '[id]',
        value : this.viewData.response.id
      }));
    }

    // Render abstract fields on model
    var abstractFields = this.viewData.response.fields;
    _.each(abstractFields, this.renderAbstractField);


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



  updateModel: function(e) {
    e.preventDefault();
    caribou.admin.update(this.viewSpec.meta.model);
  }


});
