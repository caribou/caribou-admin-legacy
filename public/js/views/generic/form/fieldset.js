_.provide('caribou.Views.Generic.Form');

caribou.Views.Generic.Form.Fieldset = Backbone.View.extend({

  tagName: 'fieldset',

  className: 'inputs',



  initialize: function() {
    _.bindAll(this, 'renderField');
    _.reverseExtend(this, this.options);
  },



  render: function() {

    var output = [
      this.make('legend', {}, '<span>Model Settings</span>'),
      this.make('ol')];

    this.$el.html(output);

    _.each(this.fields, this.renderField);

    return this;
  },



  renderField: function(field) {
    var li = this.make('li', {
      'class' : [field.format, 'input', 'required', 'stringish'].join(' '),
      'id'    : [this.viewSpec.meta.model, field.slug, 'input'].join('_')
    });

    // Handle the different kinds of fields
    var tmpl = caribou.templates.form.fields[field.format];

    // A notice if we are requesting a field type that isn't defined
    if(_.isUndefined(tmpl)) {
      console.log('[', field.format, '] Field type is not defined, go throw something at Willhite!');
      return;
    }

    // Define args seperately because some fields are special
    var args = {
      modelSlug : this.viewSpec.meta.model,
      fieldSlug : field.slug,
      value     : this.viewSpec.response[field.slug] || ''
    };

    console.log(this, field)

    if(/string|slug|integer|decimal|text|timestamp|part|link|address/.test(field.format))
      args['fieldName'] = field.label;

    // Wrap the tmpl with a list item
    li.innerHTML = _.template(tmpl, args);

    // Add the fields to the DOM
    $('ol', this.$el).prepend(li);
  }
});
