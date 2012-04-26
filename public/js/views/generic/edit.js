_.provide('caribou.Views.Generic');

caribou.Views.Generic.Edit = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.edit.main,



  initialize: function() {
    _.bindAll(this, 'renderFieldset');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var output = _.template(this.template, {
      action: this.action,
      model : this.viewSpec.meta.model,
      label : this.viewSpec.meta.view.label
    });

    // Render template
    this.$el.html(output);
debugger;
    // Render fieldsets
    var fieldsets = _.filter(this.viewSpec.response.content.main_content, function(item) {
      return item.type === 'fieldset';
    });
    _.each(fieldsets, this.renderFieldset);

    // Render hidden input
    // TODO


    return this;
  },



  renderFieldset: function(fieldset) {
    var view = new caribou.Views.Generic.Form.Fieldset({
      fields: fieldset.fields,
      viewSpec: this.viewSpec
    });

    $('fieldset.buttons', this.$el).before(view.render().el);
  }

});
