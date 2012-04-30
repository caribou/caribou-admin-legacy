_.provide('caribou.Views.Generic.Global.Navigation');

caribou.Views.Generic.Global.Navigation.Tabs = Backbone.View.extend({

  el: '#tabs',



  initialize: function() {
    _.bindAll(this, 'renderChoice', 'select');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click li[class!=has_nested] a': 'select'
  },



  render: function() {
    _.each(this.choices, this.renderChoice);


    return this;
  },



  renderChoice: function(choice, i, choices, $appendee) {
    $appendee = $appendee || this.$el;

    var _this = this,

        $tab = $(this.make('li', {
          id: choice.slug,
        }, this.make('a', {
          href          : '#',
          'data-slug'   : choice.slug,
          'data-action' : choice.action
        }, choice.label)));

    if(choice.children) {
      var $ul = $(this.make('ul'));

      _.each(choice.children, function(child) {
        _this.renderChoice(child, null, null, $ul);
      });

      $tab.addClass('has_nested');
      $tab.append($ul);

    } else {

      if(this.chosen === choice.slug)
        $tab.addClass('current');
    }

    $appendee.append($tab);
  },



  select: function(e) {
    e.preventDefault();

    var slug = $(e.target).data('slug'),
        action = $(e.target).data('action');

    caribou.admin.nav.select(slug, action);
  }

});
