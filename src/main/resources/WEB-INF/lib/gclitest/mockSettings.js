/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {


var settings = require('gcli/settings');


var tempTBoolSpec = {
  name: 'tempTBool',
  type: 'boolean',
  description: 'temporary default true boolean',
  defaultValue: true
};
exports.tempTBool = undefined;

var tempFBoolSpec = {
  name: 'tempFBool',
  type: 'boolean',
  description: 'temporary default false boolean',
  defaultValue: false
};
exports.tempFBool = undefined;

var tempUStringSpec = {
  name: 'tempUString',
  type: 'string',
  description: 'temporary default undefined string'
};
exports.tempUString = undefined;

var tempNStringSpec = {
  name: 'tempNString',
  type: 'string',
  description: 'temporary default undefined string',
  defaultValue: null
};
exports.tempNString = undefined;

var tempQStringSpec = {
  name: 'tempQString',
  type: 'string',
  description: 'temporary default "q" string',
  defaultValue: 'q'
};
exports.tempQString = undefined;

var tempNumberSpec = {
  name: 'tempNumber',
  type: 'number',
  description: 'temporary number',
  defaultValue: 42
};
exports.tempNumber = undefined;

var tempSelectionSpec = {
  name: 'tempSelection',
  type: { name: 'selection', data: [ 'a', 'b', 'c' ] },
  description: 'temporary selection',
  defaultValue: 'a'
};
exports.tempSelection = undefined;

/**
 * Registration and de-registration.
 */
exports.setup = function() {
  exports.tempTBool = settings.addSetting(tempTBoolSpec);
  exports.tempFBool = settings.addSetting(tempFBoolSpec);
  exports.tempUString = settings.addSetting(tempUStringSpec);
  exports.tempNString = settings.addSetting(tempNStringSpec);
  exports.tempQString = settings.addSetting(tempQStringSpec);
  exports.tempNumber = settings.addSetting(tempNumberSpec);
  exports.tempSelection = settings.addSetting(tempSelectionSpec);
};

exports.shutdown = function() {
  settings.removeSetting(tempTBoolSpec);
  settings.removeSetting(tempFBoolSpec);
  settings.removeSetting(tempUStringSpec);
  settings.removeSetting(tempNStringSpec);
  settings.removeSetting(tempQStringSpec);
  settings.removeSetting(tempNumberSpec);
  settings.removeSetting(tempSelectionSpec);

  exports.tempTBool = undefined;
  exports.tempFBool = undefined;
  exports.tempUString = undefined;
  exports.tempNString = undefined;
  exports.tempQString = undefined;
  exports.tempNumber = undefined;
  exports.tempSelection = undefined;
};


});
