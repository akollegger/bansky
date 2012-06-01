
define(function(require, exports, module) {


var gcli = require('gcli/index');
var neo4j = require('neo4j/index');

/**
 * Registration and de-registration.
 */
exports.startup = function() {
  gcli.addCommand(koanTop);
  gcli.addCommand(koanDescribe);
  gcli.addCommand(koanTry);
  gcli.addCommand(koanReset);

  resetKoans();
};

exports.shutdown = function() {
  gcli.removeCommand(koanTop);
  gcli.removeCommand(koanDescribe);
  gcli.removeCommand(koanTry);
  gcli.removeCommand(koanReset);
};

var koans = {
  current: 0,
  all: [
    { name:'Koan 1', 
      description:'first koan', 
      validate: function(answer) { return true; } 
    },
    { name:'Koan 2', 
      description:'second koan', 
      validate: function(answer) { return false; } 
    }
  ]
}

/**
 * Parent Command
 */
var koanTop = {
  name: 'koan',
  description: 'A progression of problems',
  manual: 'The Koans progressively elaborate a domain using Cypher queries'
};

/**
 * 'koan reset'
 */
var koanReset = {
  name: 'koan reset',
  description: 'Resets progress in answering koans',
  returnType: 'html',
  exec: function(args, context) {
    resetKoans();
    return "Let us begin, at the beginning...";
  }
}

/**
 * 'koan describe'
 */
var koanDescribe = {
  name: 'koan describe',
  description: 'Presents the problem posed by the current koan',
  returnType: 'html',
  exec: function(args, context) {
    return koans.all[koans.current].description;
  }
}

/**
 * 'koan try' command
 */
var koanTry = {
  name: 'koan try',
  description: 'Attempt to answer a koan',
  params: [
    { name: 'answer', type: 'string', description: 'Answer statement' }
  ],
  returnType: 'html',
  exec: function(args, context) {
    return evaluateKoan(koans.current, args.answer);
  }
};

var yes_messages = [
  'YES wants you to trick it out in some way.</br>',
  'YES is your web command line.</br>',
  'YES would love to be like Zsh on the Web.</br>',
  'YES is written on the Web platform, so you can tweak it.</br>'
];
function praise() {
  var index = Math.floor(Math.random() * yes_messages.length);
  return yes_messages[index];
}

var no_messages = [
  'NO wants you to trick it out in some way.</br>',
  'NO is your web command line.</br>',
  'NO would love to be like Zsh on the Web.</br>',
  'NO is written on the Web platform, so you can tweak it.</br>'
];
function encouragement() {
  var index = Math.floor(Math.random() * no_messages.length);
  return no_messages[index];
}

function evaluateKoan(kid, answer) {
  var koan = koans.all[kid];
  if (koan.validate(answer)) {
    koan.complete = true;
    koans.current += 1;
    return praise();
  } else {
    return encouragement();
  }
}

function resetKoans() {
  koans.current = 0;
  for (koan in koans) {
    koan.complete = false;
  }
}
});
