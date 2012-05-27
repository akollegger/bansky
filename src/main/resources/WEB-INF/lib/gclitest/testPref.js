/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {


var pref = require('gcli/commands/pref');
var helpers = require('gclitest/helpers');
var mockSettings = require('gclitest/mockSettings');
var test = require('test/assert');


exports.setup = function(options) {
  if (!options.isFirefox) {
    mockSettings.setup();
  }
  else {
    test.log('Skipping testPref in Firefox.');
  }
};

exports.shutdown = function(options) {
  if (!options.isFirefox) {
    mockSettings.shutdown();
  }
};

exports.testPrefSetStatus = function(options) {
  if (options.isFirefox) {
    test.log('Skipping testPref in Firefox.');
    return;
  }

  helpers.status(options, {
    typed:  'pref s',
    markup: 'IIIIVI',
    status: 'ERROR',
    directTabText: 'et'
  });

  helpers.status(options, {
    typed:  'pref set',
    markup: 'VVVVVVVV',
    status: 'ERROR',
    emptyParameters: [ ' <setting>', ' <value>' ]
  });

  helpers.status(options, {
    typed:  'pref xxx',
    markup: 'EEEEVEEE',
    status: 'ERROR'
  });

  helpers.status(options, {
    typed:  'pref set ',
    markup: 'VVVVVVVVV',
    status: 'ERROR',
    emptyParameters: [ ' <value>' ]
  });

  helpers.status(options, {
    typed:  'pref set ',
    markup: 'VVVVVVVVV',
    status: 'ERROR',
    emptyParameters: [ ' <value>' ]
  });

  helpers.status(options, {
    typed:  'pref set tempTBo',
    markup: 'VVVVVVVVVIIIIIII',
    directTabText: 'ol',
    status: 'ERROR',
    emptyParameters: [ ' <value>' ]
  });

  helpers.status(options, {
    typed:  'pref set tempTBool 4',
    markup: 'VVVVVVVVVVVVVVVVVVVE',
    directTabText: '',
    status: 'ERROR',
    emptyParameters: [ ]
  });

  helpers.status(options, {
    typed:  'pref set tempNumber 4',
    markup: 'VVVVVVVVVVVVVVVVVVVVV',
    directTabText: '',
    status: 'VALID',
    emptyParameters: [ ]
  });
};

exports.testPrefExec = function(options) {
  if (options.isFirefox) {
    test.log('Skipping testPref in Firefox.');
    return;
  }

  var initialAllowSet = pref.allowSet.value;
  pref.allowSet.value = false;

  test.is(mockSettings.tempNumber.value, 42, 'set to 42');

  helpers.exec(options, {
    typed: 'pref set tempNumber 4',
    args: {
      setting: mockSettings.tempNumber,
      value: 4
    },
    outputMatch: [ /void your warranty/, /I promise/ ]
  });

  test.is(mockSettings.tempNumber.value, 42, 'still set to 42');
  pref.allowSet.value = true;

  helpers.exec(options, {
    typed: 'pref set tempNumber 4',
    args: {
      setting: mockSettings.tempNumber,
      value: 4
    },
    blankOutput: true
  });

  test.is(mockSettings.tempNumber.value, 4, 'set to 4');

  helpers.exec(options, {
    typed: 'pref reset tempNumber',
    args: {
      setting: mockSettings.tempNumber
    },
    blankOutput: true
  });

  test.is(mockSettings.tempNumber.value, 42, 'reset to 42');

  pref.allowSet.value = initialAllowSet;

  helpers.exec(options, {
    typed: 'pref list tempNum',
    args: {
      search: 'tempNum'
    },
    outputMatch: /Filter/
  });
};


});
