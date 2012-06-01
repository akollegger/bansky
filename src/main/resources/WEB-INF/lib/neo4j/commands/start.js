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
    gcli.addCommand(cypherStartcCommandSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherStartcCommandSpec);
  };

  /**
   * 'start' command.
   */
  var cypherStartcCommandSpec = {
    name: 'start',
    returnType: 'html',
    description: 'Start a cypher pattern',
    params: [
      { name: 'query', type: 'string', description: 'complete cypher statement' }
    ],

    exec: function(args, context) {
      return cypher.query("START " + args.query, context);
    },

    manual: 'Every query describes a pattern, and in that pattern one can have multiple start points. A start point is a relationship or a node that form the starting points for a pattern match. You can either introduce start points by id, or by index lookups.',
    examples: [
      { example: 'start n=node(0) return n', 
        description:'Lookup node with id 0, and return it'},
      { example: 'start n=node:Person(name="Andreas") return n', 
        description:'Lookup node where name property is \"Andreas\" (using an index), and return it'},
      { example: 'start n=node(*) return n', 
        description:'Lookup all nodes, returning them'}
    ]

  };


});
