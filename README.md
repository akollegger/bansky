Speak softly, but carry a big can of paint
==========================================

Bansky is a Neo4j database server, using [spray-can](http://spray.cc) to server a single Cypher endpoint.


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

- Interactively

    $ ./bin/cypher

- One-liners

    $ ./bin/cypher 'start n=node(*) return n'

- Redirect entire scripts

    $ ./bin/cypher < cql/all.cql
 
