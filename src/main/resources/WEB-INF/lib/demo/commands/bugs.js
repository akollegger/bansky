/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {


var gcli = require('gcli/index');
var util = require('gcli/util');

var bugsHtml = require('text!demo/commands/bugs.html');

/**
 * Registration and de-registration.
 */
exports.startup = function() {
  gcli.addCommand(bugzCommandSpec);
};

exports.shutdown = function() {
  gcli.removeCommand(bugzCommandSpec);
};


/**
 * 'bugz' command.
 */
var bugzCommandSpec = {
  name: 'bugz',
  returnType: 'html',
  description: 'List the GCLI bugs open in Bugzilla',
  exec: function(args, context) {
    var promise = context.createPromise();

    function onFailure(msg) {
      promise.resolve(msg);
    }

    var query = 'short_desc=GCLI' +
      '&short_desc_type=allwords' +
      '&bug_status=UNCONFIRMED' +
      '&bug_status=NEW' +
      '&bug_status=ASSIGNED' +
      '&bug_status=REOPENED';

    queryBugzilla(query, function(json) {
      json.bugs.forEach(function(bug) {
        if (bug.target_milestone === '---') {
          bug.target_milestone = 'Future';
        }
      });
      json.bugs.sort(function(bug1, bug2) {
        var ms = bug1.target_milestone.localeCompare(bug2.target_milestone);
        if (ms !== 0) {
          return ms;
        }
        return bug1.priority.localeCompare(bug2.priority);
      });

      promise.resolve(context.createView({
        html: bugsHtml,
        data: json
      }));
    }, onFailure);

    return promise;
  }
};

/**
 * Simple wrapper for querying bugzilla.
 * @see https://wiki.mozilla.org/Bugzilla:REST_API
 * @see https://wiki.mozilla.org/Bugzilla:REST_API:Search
 * @see http://www.bugzilla.org/docs/developer.html
 * @see https://harthur.wordpress.com/2011/03/31/bz-js/
 * @see https://github.com/harthur/bz.js
 */
function queryBugzilla(query, onSuccess, onFailure) {
  var url = 'https://api-dev.bugzilla.mozilla.org/0.9/bug?' + query;

  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.setRequestHeader('Accept', 'application/json');
  req.setRequestHeader('Content-type', 'application/json');
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
  req.send();
}


});
