_.provide('caribou.Views.Generic.Form');

caribou.Views.Generic.Form.Fieldset = Backbone.View.extend({

  tagName: 'fieldset',

  className: 'inputs',



  initialize: function() {
    _.bindAll(this, 'renderField', 'updateAsset');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click .update': 'updateAsset'
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
    if(!field.editable || field.slug === 'position') return;

    var data = this.viewData.response;

    var li = this.make('li', {
      'class' : [field.type, 'input', 'required', 'stringish'].join(' '),
      'id'    : [this.viewSpec.meta.model, field.slug, 'input'].join('_')
    });

    // Handle the different kinds of fields
    var tmpl = caribou.templates.form.fields[field.type];

    // A notice if we are requesting a field type that isn't defined
    if(_.isUndefined(tmpl)) {
      console.log('[', field.type, '] Field type is not defined, go throw something at Willhite!');
      return;
    }

    // Define args seperately because some fields are special
    var args = {
      modelSlug : this.viewSpec.meta.model,
      fieldSlug : field.slug,
      fieldName : field.name,
      value     : data[field.slug] || ''
    };


    // Wrap the tmpl with a list item
    li.innerHTML = _.template(tmpl, args);

    // We have to wrap this in jQuery so that we can manipulate it easily
    var $li = $(li);

    //  Special conditions
    switch(field.type) {
      case 'boolean':
        if(data[field.slug])
          $('input[type=checkbox]', $li).attr('checked', 'checked')
        break;

      case 'address':
        // Fill in the values if they exist
        _.each(['_id', 'address', 'address_two', 'city', 'state', 'postal_code', 'country'], function(attr) {
          $('input[name*=' + attr + ']', $li).val(attr, field[attr]); });
        break;

      case 'asset':
        $('input[name*=_id]', $li).attr('id', field.slug + '_asset');

        if(data[field.slug]) {
          var img = this.make('img', {
            src     : [caribou.remoteAPI, data[field.slug + '_id'].path].join('/'),
            height  : '100'
          });

          $('#_thumbnail').html(this.make('a', {
            target  : '_blank',
            href    : '#'
          }, img));
        }
        break;
    };


    // Add the fields to the DOM
    $('ol', this.$el).append($li);
  },



  updateAsset: function(e) {
    e.preventDefault();

    var slug = $(this).attr('data-slug');
    caribou.admin.showUploadForm(slug);
  }
});
