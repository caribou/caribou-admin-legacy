(function(_) {

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


    // Capitalize only the first character of a string
    // with no affect on the rest
    // 'foo bar' => 'Foo bar'
    lazyCapitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
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
    },


    // Deparameterize paramterized strings
    // 'default-string' => 'defaultString'
    deparameterize: function(string) {
      return _.map(string.split('-'), function(bit, i) {
        return i ? _.capitalize(bit) : bit;
      }).join('');
    },


    // Titlecase-ize strings
    // 'default-string' => 'DefaultString'
    titlecase: function(string) {
      return _.lazyCapitalize(_.deparameterize(string));
    }



  });


  // Template stuffs
  _.templateSettings = {
    interpolate : /\{\{(.+?)\}\}/g
  };

}(require('underscore')));
