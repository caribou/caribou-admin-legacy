(function(app, Caribou, _) {

  // Renders the list or index view of a model

  // TODO workout and finalize the namespacing strategy here
  app.views.GenericModelList = Caribou.View.extend({

    id: 'main_content_wrapper',

    template: app.templates['generic-model'].list,



    initialize: function() {
      _.bindAll(this, 'renderColumnHead', 'renderRow', 'applyScope');
    },



    events: {
      'click a.table_tools_button': 'applyScope'
    },



    render: function() {


      //var table = this.viewSpec.response.content.main_content.table;
      var output = _.template(this.template.main, {});

      // Render template
      this.$el.append(output);

      //// Render scopes
      //if(this.viewSpec.response.content.main_content.scopes.length) {
      //  var scopes = _.template(caribou.templates.generic.index.scopes, {
      //    count: this.viewData.meta.count
      //  });

      //  $('#main_content', this.$el).prepend(scopes);
      //}

      // Render the table header columns
      var columnNames = _.keys(_.first(this.collection.models).attributes);
      _.each(columnNames, this.renderColumnHead);

      //// Throw another one on the end if we have table actions enabled
      //if(table.actions.length)
      $('.index_table thead tr:first', this.$el).append(this.make('th', '&nbsp;'));

      // Render each of the rows
      this.collection.each(this.renderRow);

      //// Render the footer
      //var footer = new caribou.Views.Generic.Index.Footer({
      //  viewSpec: this.viewSpec,
      //  viewData: this.viewData
      //});

      //$('.paginated_collection_contents', this.$el).after(footer.render().el);

      return this;
    },



    renderColumnHead: function(columnName) {
      var view = new app.views.genericTableHeaderColumn({
        model: columnName,
        collection: this.collection
      });
      $('.index_table thead tr:first', this.$el).append(view.render().el);
    },



    renderRow: function(model) {

      // FIXME: placeholder
      //$('.index_table tbody', this.$el).append(this.make('tr', {}, model.get('id')));

      var view = new app.views.genericModelTableRow({
        model: model
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

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
