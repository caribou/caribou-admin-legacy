_.provide('caribou.Views.Generic');

caribou.Views.Generic.Index = Backbone.View.extend({

  id: 'main_content_wrapper',

  template: caribou.templates.generic.index.main,



  initialize: function() {
    _.bindAll(this, 'renderColumnHead', 'renderRow', 'applyScope');
    _.reverseExtend(this, this.options);
  },



  events: {
    'click a.table_tools_button': 'applyScope'
  },



  render: function() {
    var table = this.viewSpec.response.content.main_content.table;
    var output = _.template(this.template, {});

    // Render template
    this.$el.html(output);

    // Render scopes
    if(this.viewSpec.response.content.main_content.scopes.length) {
      var scopes = _.template(caribou.templates.generic.index.scopes, {
        count: this.viewData.meta.count
      });

      $('#main_content', this.$el).prepend(scopes);
    }

    // Render the table header columns
    _.each(table.columns, this.renderColumnHead);

    // Throw another one on the end if we have table actions enabled
    if(table.actions.length)
      $('.index_table thead tr:first', this.$el).append(this.make('th', '&nbsp;'));

    // Render each of the rows
    _.each(this.viewData.response, this.renderRow);

    // Render the footer
    var footer = new caribou.Views.Generic.Index.Footer({
      viewSpec: this.viewSpec,
      viewData: this.viewData
    });

    $('.paginated_collection_contents', this.$el).after(footer.render().el);

    return this;
  },



  renderColumnHead: function(column) {
    var view = new caribou.Views.Generic.Table.HeaderColumn({
      data: column,
      table: this
    });
    $('.index_table thead tr:first', this.$el).append(view.render().el);
  },



  renderRow: function(row) {
    var view = new caribou.Views.Generic.Table.Row({
      data: row,
      table: this
    });
    $('.index_table tbody', this.$el).append(view.render().el);
  },



  applyScope: function(e) {
    e.preventDefault();

    var viewDataMeta = this.viewData.meta,

        params = {
          page      : viewDataMeta.page,
          page_size : viewDataMeta.page_size,
          order_by  : viewDataMeta.order_by,
          order     : viewDataMeta.order,
          scope     : 'all' },

        url = [this.viewSpec.meta.view.slug, $param(params)].join('?');

    caribou.go(url);

  }


});
