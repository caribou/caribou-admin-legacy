(function(app, Caribou, _) {

  // Renders a fieldset with fields
  // Usually references a special set of data that doesn't fit into the rest

  app.views.genericFormFieldset = Caribou.View.extend({

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


      // Append each of the appropriate fields
      var fields = app.modelData.getModelByType(this.model.meta.type).get('fields'),
          filteredFields = _.filter(fields, function(field) {
            return field.editable && !(/position|fields/).test(field.slug);
          });

      _.each(filteredFields, this.renderField);

      return this;
    },



    renderField: function(field) {
      var model = this.model;

      var li = this.make('li', {
        'class' : [field.type, 'input', 'required', 'stringish'].join(' '),
        'id'    : [model.meta.type, field.slug, 'input'].join('_')
      });

      // Handle the different kinds of fields
      var tmpl = app.templates.form.fields[field.type];

      // A notice if we are requesting a field type that isn't defined
      if(_.isUndefined(tmpl)) {
        console.log('[', field.type, '] Field type is not defined, go throw something at Willhite!');
        return;
      }

      // Define args seperately because some fields are special
      var args = {
        modelSlug : model.meta.type,
        fieldSlug : field.slug,
        fieldName : field.name,
        value     : model.get(field.slug) || ''
      };


      // Wrap the tmpl with a list item
      li.innerHTML = _.template(tmpl, args);

      // We have to wrap this in jQuery (or a jQuery-like substance) so that we can manipulate it easily
      var $li = $(li);

      //  Special conditions
      switch(field.type) {
        case 'boolean':
          if(model.get(field.slug))
            $('input[type=checkbox]', $li).attr('checked', 'checked')
          break;

        case 'address':
          // Fill in the values if they exist
          _.each(['_id', 'address', 'address_two', 'city', 'state', 'postal_code', 'country'], function(attr) {
            $('input[name*=' + attr + ']', $li).val(attr, field[attr]); });
          break;

        case 'asset':
          $('input[name*=_id]', $li).attr('id', field.slug + '_asset');

          // FIXME: this is no good
          if(model.get(field.slug)) {
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
      // FIXME: bad reference
      caribou.admin.showUploadForm(slug);
    }
  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
