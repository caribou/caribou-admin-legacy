_.provide('caribou.Views.Generic.View');

caribou.Views.Generic.View.Panel = Backbone.View.extend({

  className: 'panel',

  template: caribou.templates.generic.view.panel,


  initialize: function() {
    _.bindAll(this, 'renderPanelAttributesTable');
    _.reverseExtend(this, this.options);
  },



  render: function() {

    var output = _.template(this.template, {
      objectTitle: this.object.title
    });


    this.$el.html(output);


    // Render attributes tables
    this.renderPanelAttributesTable(this.viewData.response.fields);

    return this;
  },



  renderPanelAttributesTable: function(content) {
    var view = new caribou.Views.Generic.View.PanelAttributesTable({
      viewSpec: this.viewSpec,
      viewData: this.viewData,
      object: content
    });

    $('.panel_contents', this.$el).append(view.render().el);
  }


});
