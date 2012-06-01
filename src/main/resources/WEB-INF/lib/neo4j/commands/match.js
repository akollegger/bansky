/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {

  var gcli = require('gcli/index');
  var util = require('gcli/util');
  var neo4j = require('neo4j/index');

  /**
   * Registration and de-registration.
   */
  exports.startup = function() {
    gcli.addCommand(cypherMatchcCommandSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherMatchcCommandSpec);
  };

  /**
   * 'match' clause
   */
  var cypherMatchcCommandSpec = {
    name: 'match',
    returnType: 'html',
    description: 'Pattern matching traversal of a sub-graph',
    params: [
      { name: 'pattern', type: 'string', description: 'sub-graph pattern (from reference node)' }
    ],
    exec: function(args, context) {
      return neo4j.query("START n=node(0) MATCH p=" + args.pattern + " RETURN p", context);
    },

    examples: [
      { example: 'MATCH n--m', 
        description:'With n already known, any relationships from n to some m'},
      { example: 'MATCH n-->m', 
        description:'Any outgoing relationships from n to m'},
      { example: 'MATCH n<--m', 
        description:'Any incoming relationships to n from m'},
      { example: 'MATCH n-[:KNOWS]->m', 
        description:'Outgoing \'KNOWS\' relationships from n to m'},
      { example: 'MATCH n-[:KNOWS|LOVES]->m', 
        description:'Either outgoing \'KNOWS\' or \'LOVES\' relationships from n to m'},
      { example: 'MATCH n-[r]->m', 
        description:'From n to m, capturing any relationship as r'},
      { example: 'MATCH n-[r?]->m', 
        description:'Capture optional relationship r from n to m'},
      { example: 'MATCH n-[*1..5]->m', 
        description:'Range 1 to 5 steps across any relationships from n to m'},
      { example: 'MATCH n-[*]->m', 
        description:'Unbound steps across any relationships from n to m (handle with care)'},
      { example: 'MATCH n-->o<--m', 
        description:'From n outgoing to o, incoming from m'},
      { example: 'MATCH p=n-->m', 
        description:'From n outgoing to m, capturing entire path as p'},

    ]

  };


});
