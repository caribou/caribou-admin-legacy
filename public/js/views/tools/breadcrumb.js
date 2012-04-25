caribou.Views = caribou.Views || {};
caribou.Views.Tools = caribou.Views.Tools || {};

caribou.Views.Tools.Breadcrumb = Backbone.View.extend({

  tagName: 'span',

  className: 'breadcrumb',


  
  initialize: function() {
    _.bindAll(this, 'renderBreadcrumbParts');
  },



  render: function(breadcrumbParts) {
 
    var output = _.each(breadcrumbParts, renderBreadcrumbParts);    
    this.$el.html(output);

    return this;
  },



  renderBreadcrumbParts: function(part) {
    // TODO
  }


});
