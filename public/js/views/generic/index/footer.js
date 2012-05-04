_.provide('caribou.Views.Generic.Index');

caribou.Views.Generic.Index.Footer = Backbone.View.extend({

  id: 'index_footer',

  template: caribou.templates.generic.index.footer,



  initialize: function() {
    _.bindAll(this, 'addPagination', 'firstLink', 'previousLink', 'currentPage',
                    'currentPage', 'otherPage', 'nextLink', 'lastLink', 'pageLink');
    _.reverseExtend(this, this.options);
  },



  render: function() {
    var viewSpecMeta = this.viewSpec.meta,
        viewDataMeta = this.viewData.meta,
        urlRoot      = [caribou.remoteAPI, viewSpecMeta.view.slug].join('/');

    var output = _.template(this.template, {
      viewLabel : viewSpecMeta.view.name,
      rangeStart: (viewDataMeta.page-1)*(viewDataMeta.page_size)+1,
      rangeEnd  : (viewDataMeta.page-1)*(viewDataMeta.page_size)+viewDataMeta.count,
      totalItems: viewDataMeta.total_items,
      csvUrl    : [urlRoot, '.csv'].join('.'),
      xmlUrl    : [urlRoot, 'xml'].join('.'),
      jsonUrl   : [urlRoot, 'json'].join('.')
    });

    this.$el.html(output);


    // Add pagination
    this.addPagination();

    return this;
  },



  addPagination: function() {
    var navs = [],
        viewDataMeta = this.viewData.meta;

    if(viewDataMeta.page > 1)
      navs.push( this.firstLink(), this.previousLink() );


    var currentPage = this.currentPage,
        otherPage = this.otherPage;

    _.each(_.range(1, viewDataMeta.total_pages+1), function(pageIndex) {
      if (pageIndex === viewDataMeta.page) {
        navs.push(currentPage());
      } else {
        navs.push(otherPage(page));
      }
    });


    if(viewDataMeta.page < viewDataMeta.total_pages)
      navs.push( this.nextLink(), this.lastLink() );


    $('nav.pagination', this.$el).html(navs);

  },



  firstLink: function() {
    return this.pageLink('first', 'First &laquo;');
  },



  previousLink: function() {
    return this.pageLink('previous', {
      rel: 'previous'
    }, 'Previous &lsaquo;');
  },



  currentPage: function() {
    return this.pageLink('page current', this.viewData.meta.page);
  },



  otherPage: function(page) {
    return this.pageLink('page', page);
  },



  nextLink: function() {
    return this.pageLink('next', {
      rel: 'next'
    }, 'Next &rsaquo;');
  },



  lastLink: function() {
    return this.pageLink('last', 'Last &raquo;');
  },



  pageLink: function(spanClass, linkAttrs, linkText) {
    if(arguments.length === 2) {
      linkText = arguments[1];
      linkAttrs = {};
    }

    var link = this.make('a', _.extend({ href: '#' }, linkAttrs), linkText);
    return this.make('span', { 'class': spanClass }, link);
  }

});
