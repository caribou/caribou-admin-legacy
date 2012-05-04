_.provide('caribou.Views.Generic.Table');

caribou.Views.Generic.Table.Row = Backbone.View.extend({

  tagName: 'tr',


  initialize: function() {
    _.bindAll(this, 'renderColumn', 'renderAction', 'go', 'goEdit');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click .view_link': 'go',
    'click .edit_link': 'goEdit'
  },



  render: function() {
    var viewSpec  = this.table.viewSpec,
        table     = viewSpec.response.content.main_content.table;

    // Add the appropriate classes and id
    this.$el.attr('id', viewSpec.meta.view.slug + '_' + this.data.id);

    // Then render each column
    _.each(table.columns, this.renderColumn);

    // Finally render the appropriate actions
    this.$el.append(this.make('td'));
    $('td:last', this.$el).html(_.map(table.actions, this.renderAction));

    return this;
  },



  renderColumn: function(column) {
    var view = new caribou.Views.Generic.Table.Column({
      data: column,
      row: this,
      table: this.table
    });
    this.$el.append(view.render().el);
  },



  renderAction: function(params) {
    var action = params.action,

        actionTemplate = this.make('a', {
          'href'  : '#',
          'class' : ['member_link', action+'_link'].join(' ')
        }, _.capitalize(action));

    // Stack up the data-* for delete 'cause its special
    if(action === 'delete') {
      $(actionTemplate).attr('data-confirm', 'Are you sure you want to delete this?');
      $(actionTemplate).attr('data-method', 'delete');
      $(actionTemplate).attr('rel', 'nofollow');
    }

    return actionTemplate;
  },



  go: function(e, pathSuffix) {
    e.preventDefault();
    var path = _.compact([this.table.viewSpec.meta.view.slug, this.data.id, pathSuffix]).join('/');
    caribou.go(path);
  },



  goEdit: function(e) {
    this.go(e, 'edit');
  }



});
