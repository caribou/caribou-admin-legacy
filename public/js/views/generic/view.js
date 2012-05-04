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

    // Render the sidebar
    var sidebar = new caribou.Views.Generic.Sidebar({
      viewSpec: this.viewSpec,
      viewData: this.viewData,
      panels: {
        'model-details': {
          id: ['attributes_table', this.viewSpec.meta.view.slug, this.viewData.response.id].join('_'),
          className: this.viewSpec.meta.view.slug
        }
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



  renderPanel: function(panel, i) {

    var view = new caribou.Views.Generic.View.Panel({
      viewSpec: this.viewSpec,
      viewData: this.viewData,
      object: panel
    });

    $('#main_content', this.$el).append(view.render().el);
  }



});
