define(function(require, exports, module) {

  var gcli = require('gcli/index');
  var util = require('gcli/util');
  var cypher = require('neo4j/index');

  /**
   * Registration and de-registration.
   */
  exports.startup = function() {
    gcli.addCommand(cypherWherecCommandSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherWherecCommandSpec);
  };

  /**
   * 'where' clause
   */
  var cypherWherecCommandSpec = {
    name: 'where',
    returnType: 'html',
    hidden: true,
    description: 'Constrain nodes or relationships based on property attributes',
    params: [
      { name: 'constraints', type: 'string', description: 'conditions for properties of \'n\'' }
    ],
    exec: function(args, context) {
      return cypher.query("START n=node(*) WHERE " + args.query + " RETURN n", context);
    },

    examples: [
      { example: 'WHERE n.name=\"Andreas\"', 
        description:'filter \'n\' where where the \'name\' property equals \"Andreas\"'},
      { example: 'WHERE n.age<30', 
        description:'where '},
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
