// Stolen from http://snippets.dzone.com/posts/show/3388
// Adapted and cleaned up for underscore.js by Matt Willhite

(function() {
  var inflector = {
    inflections: {
      plural: [
      [/(quiz)$/i,               "$1zes"  ],
      [/^(ox)$/i,                "$1en"   ],
      [/([m|l])ouse$/i,          "$1ice"  ],
      [/(matr|vert|ind)ix|ex$/i, "$1ices" ],
      [/(x|ch|ss|sh)$/i,         "$1es"   ],
      [/([^aeiouy]|qu)y$/i,      "$1ies"  ],
      [/(hive)$/i,               "$1s"    ],
      [/(?:([^f])fe|([lr])f)$/i, "$1$2ves"],
      [/sis$/i,                  "ses"    ],
      [/([ti])um$/i,             "$1a"    ],
      [/(buffal|tomat)o$/i,      "$1oes"  ],
      [/(bu)s$/i,                "$1ses"  ],
      [/(alias|status)$/i,       "$1es"   ],
      [/(octop|vir)us$/i,        "$1i"    ],
      [/(ax|test)is$/i,          "$1es"   ],
      [/s$/i,                    "s"      ],
      [/$/,                      "s"      ]
      ],
      singular: [
      [/(quiz)zes$/i,                                                    "$1"     ],
      [/(matr)ices$/i,                                                   "$1ix"   ],
      [/(vert|ind)ices$/i,                                               "$1ex"   ],
      [/^(ox)en/i,                                                       "$1"     ],
      [/(alias|status)es$/i,                                             "$1"     ],
      [/(octop|vir)i$/i,                                                 "$1us"   ],
      [/(cris|ax|test)es$/i,                                             "$1is"   ],
      [/(shoe)s$/i,                                                      "$1"     ],
      [/(o)es$/i,                                                        "$1"     ],
      [/(bus)es$/i,                                                      "$1"     ],
      [/([m|l])ice$/i,                                                   "$1ouse" ],
      [/(x|ch|ss|sh)es$/i,                                               "$1"     ],
      [/(m)ovies$/i,                                                     "$1ovie" ],
      [/(s)eries$/i,                                                     "$1eries"],
      [/([^aeiouy]|qu)ies$/i,                                            "$1y"    ],
      [/([lr])ves$/i,                                                    "$1f"    ],
      [/(tive)s$/i,                                                      "$1"     ],
      [/(hive)s$/i,                                                      "$1"     ],
      [/([^f])ves$/i,                                                    "$1fe"   ],
      [/(^analy)ses$/i,                                                  "$1sis"  ],
      [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, "$1$2sis"],
      [/([ti])a$/i,                                                      "$1um"   ],
      [/(n)ews$/i,                                                       "$1ews"  ],
      [/s$/i,                                                            ""       ]
      ],
      irregular: [
      ['move',   'moves'   ],
      ['sex',    'sexes'   ],
      ['child',  'children'],
      ['man',    'men'     ],
      ['person', 'people'  ]
      ],
      uncountable: [
      "sheep",
      "fish",
      "series",
      "species",
      "money",
      "rice",
      "information",
      "equipment"
      ]
    },
    ordinalize: function(number) {
      if (11 <= parseInt(number) % 100 && parseInt(number) % 100 <= 13) {
        return number + "th";
      } else {
        switch (parseInt(number) % 10) {
          case  1: return number + "st";
          case  2: return number + "nd";
          case  3: return number + "rd";
          default: return number + "th";
        }
      }
    },
    pluralize: function(word) {
      for (var i = 0; i < inflector.inflections.uncountable.length; i++) {
        var uncountable = inflector.inflections.uncountable[i];
        if (word.toLowerCase == uncountable) {
          return uncountable;
        }
      }
      for (var i = 0; i < inflector.inflections.irregular.length; i++) {
        var singular = inflector.inflections.irregular[i][0];
        var plural   = inflector.inflections.irregular[i][1];
        if ((word.toLowerCase == singular) || (word == plural)) {
          return plural;
        }
      }
      for (var i = 0; i < inflector.inflections.plural.length; i++) {
        var regex          = inflector.inflections.plural[i][0];
        var replace_string = inflector.inflections.plural[i][1];
        if (regex.test(word)) {
          return word.replace(regex, replace_string);
        }
      }
    },
    singularize: function(word) {
      for (var i = 0; i < inflector.inflections.uncountable.length; i++) {
        var uncountable = inflector.inflections.uncountable[i];
        if (word.toLowerCase == uncountable) {
          return uncountable;
        }
      }
      for (var i = 0; i < inflector.inflections.irregular.length; i++) {
        var singular = inflector.inflections.irregular[i][0];
        var plural   = inflector.inflections.irregular[i][1];
        if ((word.toLowerCase == singular) || (word == plural)) {
          return plural;
        }
      }
      for (var i = 0; i < inflector.inflections.singular.length; i++) {
        var regex          = inflector.inflections.singular[i][0];
        var replace_string = inflector.inflections.singular[i][1];
        if (regex.test(word)) {
          return word.replace(regex, replace_string);
        }
      }
    }
  };

  var ordinalize = function (number) {
    return inflector.ordinalize(number);
  };
  
  _.mixin({  
    pluralize: function(string, count, plural) {
      if (typeof count == 'undefined') {
        return inflector.pluralize(string);
      } else {
        return count + ' ' + (1 == parseInt(count) ? string : plural || inflector.pluralize(string));
      }
    },
    
    singularize: function(string, count) {
      if (typeof count == 'undefined') {
        return inflector.singularize(string);
      } else {
        return count + " " + inflector.singularize(string);
      }
    }
  });
  
}());
