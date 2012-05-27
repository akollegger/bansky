
# Developing GCLI

## About the code

The majority of the GCLI source is stored in the ``lib`` directory.

The ``docs`` directory contains documentation.
The ``scripts`` directory contains RequireJS and ES5-shim code that GCLI uses.
The ``build`` directory contains files used when creating builds.
The ``mozilla`` directory contains the mercurial patch queue of patches to apply
to mozilla-central.
The ``selenium-tests`` directory contains selenium web-page integration tests.

The source in the ``lib`` directory is split into 4 sections:

- ``lib/demo`` contains commands used in the demo page. It is not needed except
  for demo purposes.
- ``lib/test`` contains a small test harness for testing GCLI.
- ``lib/gclitest`` contains tests that run in the test harness
- ``lib/gcli`` contains the actual meat

GCLI is split into a UI portion and a Model/Controller portion.


## The GCLI Model

The heart of GCLI is a ``Requisition``, which is an AST for the input. A
``Requisition`` is a command that we'd like to execute, and we're filling out
all the inputs required to execute the command.

A ``Requisition`` has a ``Command`` that is to be executed. Each Command has a
number of ``Parameter``s, each of which has a name and a type as detailed
above.

As you type, your input is split into ``Argument``s, which are then assigned to
``Parameter``s using ``Assignment``s. Each ``Assignment`` has a ``Conversion``
which stores the input argument along with the value that is was converted into
according to the type of the parameter.

There are special assignments called ``CommandAssignment`` which the
``Requisition`` uses to link to the command to execute, and
``UnassignedAssignment``used to store arguments that do not have a parameter
to be assigned to.


## The GCLI UI

There are several components of the GCLI UI. Each can have a script portion,
some template HTML and a CSS file. The template HTML is processed by
``domtemplate`` before use.

DomTemplate is fully documented in [it's own repository]
(https://github.com/joewalker/domtemplate).

The components are:

- ``Inputter`` controls the input field, processing special keyboard events and
  making sure that it stays in sync with the Requisition.
- ``Completer`` updates a div that is located behind the input field and used
  to display completion advice and hint highlights. It is stored in
  completer.js.
- ``Display`` is responsible for containing the popup hints that are displayed
  above the command line. Typically Display contains a Hinter and a RequestsView
  although these are not both required. Display itself is optional, and isn't
  planned for use in the first release of GCLI in Firefox.
- ``Hinter`` Is used to display input hints. It shows either a Menu or an
  ArgFetch component depending on the state of the Requisition
- ``Menu`` is used initially to select the command to be executed. It can act
  somewhat like the Start menu on windows.
- ``ArgFetch`` Once the command to be executed has been selected, ArgFetch
  shows a 'dialog' allowing the user to enter the parameters to the selected
  command.
- ``RequestsView`` Contains a set of ``RequestView`` components, each of which
  displays a command that has been invoked. RequestsView is a poor name, and
  should better be called ReportView

ArgFetch displays a number of Fields. There are fields for most of the Types
discussed earlier. See 'Writing Fields' above for more information.


## Assumed Environment

There are differences between the environment provided by a browser and the
environment in a JSM in Firefox. We attempt to make this environment as
browser-like as possible.

- ``console``: The console object doesn't exist in firefox (although it could
  and dump() is close)
  There is an implementation of ``console`` in the ``build/prefix-gcli.jsm``
  which uses ``dump()``.
  Since the GCLI jsm is built from all the GCLI JS files concatenated together,
  we could use this implementation directly as all the files are in the same
  lexical scope. However for historical reasons (not all browsers used to have
  console objects, and their implementation isn't uniform) we wrap this as a
  CommonJS module, and import it as needed, which allows us to provide
  different stubs to certain browsers.
  At some stage we should probably allow use of ``console`` without importing
  it first.

- ``document/window``: It is common to want access to ``document`` and
  ``window`` when doing DOM manipulation or using timeouts/intervals, however
  there is no concept of the current window when in chrome.
  The web console, however is tied to a window, so we could allow use of a
  CommonJS imported ``document/window`` object however this would only work for
  commands defined inside gcli.jsm. Instead we provide a getDocument() method
  on the ExecutionContext.

- ``Node``/``DOMElement``/etc: The Mozilla JSM environment does not define DOM
  objects like the Node constructor etc for use in constants and instanceof.
  Currently the lack of these objects is mostly hacked around, however we
  probably should support this better. (See [bug 668488)
  [https://bugzilla.mozilla.org/show_bug.cgi?id=668488])


## Testing

GCLI contains 3 test suites:

- JS level testing is run with the ``test`` command. The tests are located in
  ``lib/gclitest`` and they use the test runner in ``lib/test``. This is fairly
  comprehensive, however it does not do UI level testing.
  If writing a new test it needs to be registered in ``lib/gclitest/index``.
  For an example of how to write tests, see ``lib/gclitest/testSplit.js``.
  The test functions are implemented in ``lib/test/assert``.
- Browser integration tests are included in ``browser_webconsole_gcli_*.js``,
  in ``toolkit/components/console/hudservice/tests/browser``. These are
  run with the rest of the Mozilla test suite.
- Selenium tests for testing UI interaction are included in ``selenium-tests``.


## Coding Conventions

The coding conventions for the GCLI project come from the Bespin/Skywriter and
Ace projects. They are roughly [Crockford]
(http://javascript.crockford.com/code.html) with a few exceptions and
additions:

* ``var`` does not need to be at the top of each function, we'd like to move
  to ``let`` when it's generally available, and ``let`` doesn't have the same
  semantic twists as ``var``.

* Strings are generally enclosed in single quotes.

* ``eval`` is to be avoided, but we don't declare it evil.

The [Google JavaScript conventions]
(https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) are
more detailed, we tend to deviate in:

* Custom exceptions: We generally just use ``throw new Error('message');``

* Multi-level prototype hierarchies: Allowed; we don't have ``goog.inherits()``

* ``else`` begins on a line by itself:

        if (thing) {
          doThis();
        }
        else {
          doThat();
        }

We may have markers in the code as follows:

* ``TODO``: This marks code that needs fixing before we do a release. We should
  either fix the code or raise a bug and link using ``BUG``

* ``IDEAL``: Sometimes we know the code we'd like to write, but need a
  pragmatic solution that works for now. In these cases we should mark the
  code and document the ``IDEAL`` solution.

* ``FUTURE``: There are cases where the code we'd like to write isn't possible
  because not all browsers support the feature we'd like to use. This tag
  should be used sparingly (i.e. not for every ``var`` that we'd like to be
  ``let``). es5shim should be used where possible.

* ``BUG XXXXXX``: Where a known bug affects some code, we mark it with the bug
  to help us keep track of bugs and the code that is affected.


## Startup

Internally GCLI modules have ``startup()``/``shutdown()`` functions which are
called on module init from the top level ``index.js`` of that 'package'.

In order to initialize a package all that is needed is to require the package
index (e.g. ``require('package/index')``).

The ``shutdown()`` function was useful when GCLI was used in Bespin as part of
dynamic registration/de-registration. It is not known if this feature will be
useful in the future. So it has not been entirely removed, it may be at some
future date.


## Running the Unit Tests

Start the GCLI static server:

    cd path/to/gcli
    python static.py

Now point your browser to [http://localhost:9999/][]. When the page loads, you
should see the command line; enter the ``test`` command to run the unit tests.
