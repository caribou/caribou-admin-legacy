// Adding functionality
_.mixin({


  // Capitalize a string
  // 'foo bar' => 'Foo Bar'
  capitalize: function(string) {
    var bits = string.split(/[_ ]+/);
    var shaped = _.map(bits, function(bit) {
      var low = bit.toLowerCase();
      return low.charAt(0).toUpperCase() + low.slice(1);
    });
    return shaped.join(' ');
  },


  // Slugify (parameterize) a string
  // 'Foo Bar' => 'foo_bar'
  slugify: function(string) {
    var bits = string.split(/[^a-zA-Z]+/);
    var shaped = _.map(bits, function(bit) {
      return bit.toLowerCase();
    });
    return shaped.join('_');
  },


  // Provide a namespace (like goog.provides)
  // 'foo.bar.baz' => { foo: { bar: { baz: {}}}}
  provide: function(namespace) {
    var bits = namespace.split('.');
    for(i=0, l=bits.length, root=window; i<l; i++) {
      root[bits[i]] = root[bits[i]] || {};
      root = root[bits[i]];
    }
  }
  
});


// Template stuffs
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};
