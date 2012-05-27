/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {

  var settings = require('gcli/settings');
  var gcli = require('gcli/index');
  var util = require('gcli/util');

  var cypherHtml = require('text!cypher/commands/cypher-table.html');

  var cypherUrlSettingSpec = {
    name: 'cypherUrl',
    type: 'string',
    description: 'URL of Cypher REST endpoint',
    defaultValue: '/cypher'
  };
  var cypherUrl;

  /**
   * Registration and de-registration.
   */
  exports.startup = function() {
    gcli.addCommand(cypherStartcCommandSpec);
    cypherUrl = settings.addSetting(cypherUrlSettingSpec);
  };

  exports.shutdown = function() {
    gcli.removeCommand(cypherStartcCommandSpec);
    settings.removeSetting(cypherUrlSettingSpec);
    cypherUrl = undefined;
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
    var promise = context.createPromise();

    function onFailure(msg) {
      promise.resolve(msg);
    }

    var query = "START " + args.query;

    queryCypher(query, function(json) {
      promise.resolve(context.createView({
        html: cypherHtml,
        data: { "rows": json },
        options: { allowEval:true },
        css: require('text!cypher/commands/cypher_result.css'),
        cssId: 'cypher-result-table'
      }));
    }, onFailure);

    return promise;
  }
};

function queryCypher(query, onSuccess, onFailure) {
  var url = cypherUrl.value;

  var req = new XMLHttpRequest();
  req.open('POST', url, true);
  req.setRequestHeader('Accept', 'application/json');
  req.setRequestHeader('Content-type', 'text/plain');
  req.onreadystatechange = function(event) {
    if (req.readyState == 4) {
      if (req.status >= 300 || req.status < 200) {
        onFailure('Error: ' + JSON.stringify(req));
        return;
      }

      var json;
      try {
        json = JSON.parse(req.responseText);
      }
      catch (ex) {
        onFailure('Invalid response: ' + ex + ': ' + req.responseText);
        return;
      }

      if (json.error) {
        onFailure('Error: ' + json.error.message);
        return;
      }

      onSuccess(json);

    }
  }.bind(this);
  req.send(query);
}


});
