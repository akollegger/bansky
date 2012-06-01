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
    gcli.addCommand(cypherOverviewcCommandSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherOverviewcCommandSpec);
  };

  /**
   * 'match' clause
   */
  var cypherOverviewcCommandSpec = {
    name: 'cypher',
    returnType: 'html',
    description: 'Cypher is a pattern-matching query language for graph data',
    manual: 'Cypher is a pattern-matching query language for graph data. '
    + 'The examples below illustrate the grammar of the main clauses -- START, MATCH, WHERE, SET, CREATE, DELETE, RELATE and RETURN. '
    + 'For details and examples about the clauses, ask for help about them.',
    params: [
      { name: 'query', type: 'string', description: 'full cypher query statement' }
    ],
    exec: function(args, context) {
      return cypher.query(args.query, context);
    },

    examples: [
      { example: 'START <lookup> RETURN <expressions>', 
        description:'Find: Lookup some graph elements (which binds them to terms), then return expressions'},
      { example: 'START <lookup> [MATCH <pattern> WHERE <constraints>] RETURN <expressions>', 
        description:'Find: Bind terms, optionally match a pattern with optional constraint conditions conditions, return expressions'},
      { example: '[START <lookup> CREATE <node>[,<node|relationship>] [RETURN <expression>]', 
        description:'Create: Optional bind, then Create node(s) and relationship(s), with an optional return expression'},
      { example: 'START <lookup> SET <update> [RETURN <expressions>]', 
        description:'Update: Bind terms, update properties, return expressions'},
      { example: 'START <lookup> [MATCH <pattern> WHERE <constraint>] DELETE <terms>', 
        description:'Delete: Bind, optionally match & constrain, then delete particular terms'},
      { example: 'START <lookup> RELATE <pattern> [RETURN <expressions>]', 
        description:'Find or Create: Bind, then match a sub-graph or create missing nodes & relationships to satisfy the pattern.'}

    ]

  };


});
