define(function(require, exports, module) {

  var settings = require('gcli/settings');

  require('gcli/index');

  require('gcli/commands/pref').startup();

  help = require('gcli/commands/help');
  help.startup();

  require('neo4j/commands/intro').startup();
  require('neo4j/commands/cypher').startup();
  require('neo4j/commands/start').startup();
  require('neo4j/commands/match').startup();
  require('neo4j/commands/where').startup();
  require('neo4j/commands/create').startup();
  require('neo4j/commands/relate').startup();

  help.helpManHtml = require('text!neo4j/commands/help_man.html');
  help.helpListHtml = require('text!neo4j/commands/help_list.html');
  help.helpCss = require('text!neo4j/commands/help.css');

  var cypherHtml = require('text!neo4j/commands/cypher-table.html');

  var cypherUrlSettingSpec = {
    name: 'cypherUrl',
    type: 'string',
    description: 'URL of Cypher REST endpoint',
    defaultValue: '/cypher'
  };
  var cypherUrl = settings.addSetting(cypherUrlSettingSpec);

  var cypherPostTypeSettingSpec = {
    name: 'cypherPostType',
    type: { name: 'selection', data: [ 'text/plain', 'application/json'] },
    description: 'Content type for Cypher query POSTs',
    defaultValue: 'text/plain'
  };
  var cypherPostType = settings.addSetting(cypherPostTypeSettingSpec);

  exports.query = function(cql, context) {
    
    var promise = context.createPromise();

    function onFailure(msg) {
      promise.resolve(msg);
    }

    queryCypher(cql, function(json) {
      promise.resolve(context.createView({
        html: cypherHtml,
        data: { "result": json },
        options: { allowEval:true },
        css: require('text!neo4j/commands/cypher_result.css'),
        cssId: 'cypher-result-table'
      }));
    }, onFailure);

    return promise;
  }

  function queryCypher(query, onSuccess, onFailure) {
    var url = cypherUrl.value;

    var req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('Content-type', cypherPostType.value);
    req.onreadystatechange = function(event) {
      if (req.readyState == 4) {
        if (req.status == 400) {
          onFailure(req.responseText);
          return;
        } else if (req.status >= 300 || req.status < 200) {
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
    if (cypherPostType.value==='application/json') {
      query = '{\"query\":\"'+query+'\" }'
    }
    req.send(query);
  }

});
