_.provide('caribou.Views.Global.Notification');

caribou.Views.Global.Notification.Flash = Backbone.View.extend({

  el: '.flashes',



  initialize: function() {
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var output = this.make('div', {
      'class': 'flash flash_' + this.type
    }, this.message);

    this.$el.html(output);

    return this;
  }


});
