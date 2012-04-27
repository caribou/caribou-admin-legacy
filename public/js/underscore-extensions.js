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
  provide: function(namespace, root) {
    var bits = namespace.split('.');
    for(i=0, l=bits.length, root= root || window; i<l; i++) {
      root[bits[i]] = root[bits[i]] || {};
      root = root[bits[i]];
    }
  },


  // Just like extend, except it won't overwrite an existing property
  reverseExtend: function(obj) {
    _.each(Array.prototype.slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = obj[prop] || source[prop];
      }
    });
    return obj;
  },


  // Parameratize's camel-cased strings
  // 'defaultString' => 'default-string'
  parameterize: function(string) {
    return _.map(_.rest(string.match(/^(.*[a-z])([A-Z].*)$/)), function(bit) {
      return bit.toLowerCase();
    }).join('-');
  }


});


// Template stuffs
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g
};
