_.provide('caribou.Views.Global.Navigation');

caribou.Views.Global.Navigation.Breadcrumb = Backbone.View.extend({

  el: '.breadcrumb',

  template: caribou.templates.global.navigation.breadcrumb,



  initialize: function() {
    _.bindAll(this, 'go');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click a': 'go'
  },



  render: function() {
    var _this = this;

    var output = _.map(this.parts, function(part) {
      return _.template(_this.template, {
        label: part.label,
        action: part.action
      });
    }).join('');

    this.$el.html(output);

    return this;
  },



  go: function(e) {
    e.preventDefault();

    var action = $(e.target).data('action');
    caribou.go(action);
  }

});
