caribou.Views = caribou.Views || {};
caribou.Views.Tools = caribou.Views.Tools || {};

caribou.Views.Tools.ActionItem = Backbone.View.extend({

  tagName: 'span',

  className: 'action_item',

  template: '<a href="#">{{ label }}</a>',



  initialize: function() {
    _.bindAll(this, 'go');
  },



  events: {
    'click a': 'go'
  },



  // FIXME: passing in the actionItem is smelly
  render: function(actionItem) {

    this.actionItem = actionItem;

    var output = _.template(this.template, {
      label: actionItem.label
    });

    this.$el.html(output);

    return this;
  },



  go: function(e) {
    e.preventDefault();
    caribou.go(this.actionItem.action);
  }


});
