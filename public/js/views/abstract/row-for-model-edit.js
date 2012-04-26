_.provide('caribou.Views.Abstract.RowForModelEdit');

caribou.Views.Abstract.RowForModelEdit = Backbone.View.extend({

  tagName: 'tr',

  template: caribou.templates['abstract']['row-for-model-edit'],



  initialize: function() {
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var fieldTypes = caribou.modelFieldTypes(),
        field = this.field;

    var output = _.template(this.template, {
      name          : field.name,
      type          : field.type,
      id            : field.id,
      index         : this.index,
      fieldType     : fieldTypes[field.type].name,
      modelPosition : field.model_position
    });

    this.$el.html(output);

    return this;
  }

});
