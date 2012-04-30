_.provide('caribou.Views.Generic');

caribou.Views.Generic.View = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.view.main,



  initialize: function() {
    _.bindAll(this, 'renderPanel');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var output = _.template(this.template);

    this.$el.html(output);

    // Render each of the panels
    _.each(this.viewSpec.response.content.main_content, this.renderPanel);


    return this;
  },



  renderPanel: function(panel, i) {

    var view = new caribou.Views.Generic.View.Panel({
      viewSpec: this.viewSpec,
      viewData: this.viewData,
      object: panel
    });

    $('#main_content', this.$el).append(view.render().el);
  }



});
