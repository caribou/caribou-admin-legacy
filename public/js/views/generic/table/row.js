(function(app, Caribou, _) {

  // Renders a table row with columns for each attribute
  // TODO: Rig this up to a viewSpec

  app.views.genericModelTableRow = Caribou.View.extend({

    tagName: 'tr',


    initialize: function() {
      _.bindAll(this, 'renderColumn', 'renderAction', 'go', 'goEdit');
    },



    events: {
      'click .view_link': 'go',
      'click .edit_link': 'goEdit'
    },



    render: function() {
      var model = this.model;

      //var viewSpec  = this.table.viewSpec,
      //    table     = viewSpec.response.content.main_content.table;

      // Add the appropriate classes and id
      this.$el.attr('id', model.get('slug') +'_'+ model.get('id'));

      var modelType = model.collection.meta.type,
          modelData = app.modelData.where({ slug: modelType })[0],
          columnSlugs = _.pluck(modelData.get('fields'), 'slug');

      // Then render each column
      for(var i=0, l=columnSlugs.length; i<l; i++) {
        this.renderColumn(model.attributes[columnSlugs[i]]);
      }

      //
      // Finally render the appropriate actions
      this.$el.append(this.make('td'));
      var actions = ['view', 'edit', 'delete'];
      $('td:last', this.$el).append(_.map(actions, this.renderAction));

      return this;
    },



    renderColumn: function(attribute) {
      //var view = new caribou.Views.Generic.Table.Column({
      //  data: column,
      //  row: this,
      //  table: this.table
      //});
      //this.$el.append(view.render().el);
      if(_.isNull(attribute) || _.isUndefined(attribute)) attribute = '';

      this.$el.append(this.make('td', {}, attribute.toString()));
    },



    renderAction: function(action) {

      var actionTemplate = this.make('a', {
            'href'  : [window.location.toString(), this.model.id].join('/'),
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



    go: function(e) {
      e.preventDefault();

      app.router.navigate([this.model.collection.meta.type, this.model.id].join('/'), { trigger:true });
    },



    goEdit: function(e) {
      this.go(e, 'edit');
    }



  });

}(
  require('app'),
  require('Caribou'),
  require('underscore')
));
