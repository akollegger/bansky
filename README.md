Speak softly, but carry a big can of paint
==========================================

Bansky is a Neo4j database server, using [spray-can](http://spray.cc) to offer up a single Cypher endpoint.

# Dependencies

- Requires sbt 0.11.1 to build.

# How to run

Clone this repository, then run the application in one of the following ways.

- Locally using sbt

        $ sbt clean compile run

- Locally using foreman (simulates Heroku)

        $ sbt clean compile stage
        ...
        $ foreman start

# Shake up some Cypher queries

- Interactively (producing human friendly results)

    $ ./bin/cypher

- One-liners (also human friendly)

    $ ./bin/cypher 'start n=node(*) return n'

- Redirect entire scripts (piped input produces json output)

    $ ./bin/cypher < cql/all.cql
 
- Pipe to [jgrep](http://jgrep.org/) or (jsawk)[https://github.com/micha/jsawk]

    # cat cql/all.sql | ./bin/cypher | jgrep

