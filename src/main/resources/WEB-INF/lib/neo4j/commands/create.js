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
    gcli.addCommand(cypherCreatecCommandSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherCreatecCommandSpec);
  };

  /**
   * 'create' command.
   */
  var cypherCreatecCommandSpec = {
    name: 'create',
    returnType: 'html',
    description: 'Create nodes and relationships',
    params: [
      { name: 'spec', type: 'string', description: 'specification for new nodes and relationships' }
    ],

    exec: function(args, context) {
      return cypher.query("CREATE " + args.spec, context);
    },

    examples: [
      { example:'CREATE n', 
        description: 'Create a single node'},
      { example:'CREATE n,m', 
        description: 'Create two nodes'},
      { example:'CREATE n,m,m-[:KNOWS]-m', 
        description: 'Create two nodes, and a specific relationship (be confident, no anonymous relationships allowed)'},
      { example:'CREATE n = {name : \'Neo\', title : \'The One\'}', 
        description: 'Create a single node with properties'}
    ]

  };


});
