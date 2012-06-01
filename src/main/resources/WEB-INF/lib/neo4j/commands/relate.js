/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {

  var gcli = require('gcli/index');
  var util = require('gcli/util');
  var cypher = require('neo4j/index');

  /**
   * Registration and de-registration.
   */
  exports.startup = function() {
    gcli.addCommand(cypherRelatecCommandSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherRelatecCommandSpec);
  };

  /**
   * 'create' command.
   */
  var cypherRelatecCommandSpec = {
    name: 'relate',
    returnType: 'html',
    description: 'Ensure pattern exists, match if possible, create if needed',
    manual: 'Relate ensures that the specified sub-graph pattern exists, by first looking for a match, then creating any nodes and relationships needed to satisfy the pattern.',
    params: [
      { name: 'pattern', type: 'string', description: 'specification for pattern that should exist' }
    ],

    exec: function(args, context) {
      return cypher.query("RELATE " + args.spec, context);
    },

    examples: [
      { example:'RELATE n-[:KNOWS]-m', 
        description: 'Relate n to m with a KNOWS relationship, creating the \'KNOWS\' relationship if it doesn\'t exist'},
      { example:'RELATE n-[:KNOWS]-(m {name:"inem"})', 
        description: 'Relate n KNOWS m where m has name "inem", creating relationship and m (with the specified properties) if needed'}
    ]

  };


});
