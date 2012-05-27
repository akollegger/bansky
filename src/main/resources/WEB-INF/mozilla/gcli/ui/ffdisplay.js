/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

define(function(require, exports, module) {

var Inputter = require('gcli/ui/inputter').Inputter;
var Completer = require('gcli/ui/completer').Completer;
var Tooltip = require('gcli/ui/tooltip').Tooltip;
var FocusManager = require('gcli/ui/focus').FocusManager;

var Requisition = require('gcli/cli').Requisition;

var cli = require('gcli/cli');
var jstype = require('gcli/types/javascript');
var nodetype = require('gcli/types/node');
var resource = require('gcli/types/resource');
var host = require('gcli/host');
var intro = require('gcli/ui/intro');

var commandOutputManager = require('gcli/canon').commandOutputManager;

/**
 * Handy utility to inject the content document (i.e. for the viewed page,
 * not for chrome) into the various components.
 */
function setContentDocument(document) {
  if (document) {
    // TODO: this unwrapping smells
    // jstype.setGlobalObject(unwrap(document.defaultView));
    nodetype.setDocument(document);
    resource.setDocument(document);
  }
  else {
    resource.unsetDocument();
    nodetype.unsetDocument();
    jstype.unsetGlobalObject();
  }
}

/**
 * FFDisplay is responsible for generating the UI for GCLI, this implementation
 * is a special case for use inside Firefox
 * @param options A configuration object containing the following:
 * - contentDocument (optional)
 * - chromeDocument
 * - hintElement
 * - inputElement
 * - completeElement
 * - backgroundElement
 * - outputDocument
 * - consoleWrap (optional)
 * - eval (optional)
 * - environment
 * - scratchpad (optional)
 * - chromeWindow
 */
function FFDisplay(options) {
  if (options.eval) {
    cli.setEvalFunction(options.eval);
  }
  setContentDocument(options.contentDocument);
  host.chromeWindow = options.chromeWindow;

  this.onOutput = commandOutputManager.onOutput;
  this.requisition = new Requisition(options.environment, options.outputDocument);

  // Create a FocusManager for the various parts to register with
  this.focusManager = new FocusManager(options, {
    // TODO: can we kill chromeDocument here?
    document: options.chromeDocument
  });
  this.onVisibilityChange = this.focusManager.onVisibilityChange;

  this.inputter = new Inputter(options, {
    requisition: this.requisition,
    focusManager: this.focusManager,
    element: options.inputElement
  });

  this.completer = new Completer(options, {
    requisition: this.requisition,
    inputter: this.inputter,
    backgroundElement: options.backgroundElement,
    element: options.completeElement
  });

  this.tooltip = new Tooltip(options, {
    requisition: this.requisition,
    focusManager: this.focusManager,
    inputter: this.inputter,
    element: options.hintElement
  });

  this.inputter.tooltip = this.tooltip;

  if (options.consoleWrap) {
    this.consoleWrap = options.consoleWrap;
    var win = options.consoleWrap.ownerDocument.defaultView;
    this.resizer = this.resizer.bind(this);

    win.addEventListener('resize', this.resizer, false);
    this.requisition.onTextChange.add(this.resizer, this);
  }

  this.options = options;
}

/**
 * The main Display calls this as part of startup since it registers listeners
 * for output first. The firefox display can't do this, so it has to be a
 * separate method
 */
FFDisplay.prototype.maybeShowIntro = function() {
  intro.maybeShowIntro(commandOutputManager);
};

/**
 * Called when the page to which we're attached changes
 * @params options Object with the following properties:
 * - contentDocument: Points to the page that we should now work against
 * - environment: A replacement environment for Requisition use
 * - chromeWindow: Allow node type to create overlay
 */
FFDisplay.prototype.reattach = function(options) {
  setContentDocument(options.contentDocument);
  host.chromeWindow = options.chromeWindow;
  this.requisition.environment = options.environment;
};

/**
 * Avoid memory leaks
 */
FFDisplay.prototype.destroy = function() {
  if (this.consoleWrap) {
    var win = this.options.consoleWrap.ownerDocument.defaultView;

    this.requisition.onTextChange.remove(this.resizer, this);
    win.removeEventListener('resize', this.resizer, false);
  }

  this.tooltip.destroy();
  this.completer.destroy();
  this.inputter.destroy();
  this.focusManager.destroy();

  this.requisition.destroy();

  host.chromeWindow = undefined;
  setContentDocument(null);
  cli.unsetEvalFunction();

  delete this.options;

  // We could also delete the following objects if we have hard-to-track-down
  // memory leaks, as a belt-and-braces approach, however this prevents our
  // DOM node hunter script from looking in all the nooks and crannies, so it's
  // better if we can be leak-free without deleting them:
  // - consoleWrap, resizer, tooltip, completer, inputter,
  // - focusManager, onVisibilityChange, requisition
};

/**
 * Called on chrome window resize, or on divider slide
 */
FFDisplay.prototype.resizer = function() {
  // Bug 705109: There are several numbers hard-coded in this function.
  // This is simpler than calculating them, but error-prone when the UI setup,
  // the styling or display settings change.

  var parentRect = this.options.consoleWrap.getBoundingClientRect();
  // Magic number: 64 is the size of the toolbar above the output area
  var parentHeight = parentRect.bottom - parentRect.top - 64;

  // Magic number: 100 is the size at which we decide the hints are too small
  // to be useful, so we hide them
  if (parentHeight < 100) {
    this.options.hintElement.classList.add('gcliterm-hint-nospace');
  }
  else {
    this.options.hintElement.classList.remove('gcliterm-hint-nospace');
    this.options.hintElement.style.overflowY = null;
    this.options.hintElement.style.borderBottomColor = 'white';
  }

  // We also try to make the max-width of any GCLI elements so they don't
  // extend outside the scroll area.
  var doc = this.options.hintElement.ownerDocument;

  var outputNode = this.options.hintElement.parentNode.parentNode.children[1];
  var outputs = outputNode.getElementsByClassName('gcliterm-msg-body');
  var listItems = outputNode.getElementsByClassName('hud-msg-node');

  // This is an top-side estimate. We could try to calculate it, maybe using
  // something along these lines http://www.alexandre-gomes.com/?p=115 However
  // experience has shown this to be hard to get to work reliably
  // Also we don't need to be precise. If we use a number that is too big then
  // the only down-side is too great a right margin
  var scrollbarWidth = 20;

  if (listItems.length > 0) {
    var parentWidth = outputNode.getBoundingClientRect().width - scrollbarWidth;
    var otherWidth;
    var body;

    for (var i = 0; i < listItems.length; ++i) {
      var listItem = listItems[i];
      // a.k.a 'var otherWidth = 132'
      otherWidth = 0;
      body = null;

      for (var j = 0; j < listItem.children.length; j++) {
        var child = listItem.children[j];

        if (child.classList.contains('gcliterm-msg-body')) {
          body = child.children[0];
        }
        else {
          otherWidth += child.getBoundingClientRect().width;
        }

        var styles = doc.defaultView.getComputedStyle(child, null);
        otherWidth += parseInt(styles.borderLeftWidth, 10) +
                      parseInt(styles.borderRightWidth, 10) +
                      parseInt(styles.paddingLeft, 10) +
                      parseInt(styles.paddingRight, 10) +
                      parseInt(styles.marginLeft, 10) +
                      parseInt(styles.marginRight, 10);
      }

      if (body) {
        body.style.width = (parentWidth - otherWidth) + 'px';
      }
    }
  }
};

exports.FFDisplay = FFDisplay;

});
