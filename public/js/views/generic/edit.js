_.provide('caribou.Views.Generic');

caribou.Views.Generic.Edit = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.edit.main,



  initialize: function() {
    _.bindAll(this, 'renderFieldset', 'renderAbstractField');
    _.reverseExtend(this, this.options);
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
    // TODO

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
      index: i
    });

    $('.model_fields_edit_table table tbody', this.$el).append(view.render().el);
  }


});
