package org.akollegger.app.bansky

import cc.spray.Directives
import cc.spray.http.MediaTypes._

import akka.actor.{PoisonPill, Actor, Scheduler}
import java.util.concurrent.TimeUnit
import org.neo4j.kernel.EmbeddedGraphDatabase
import org.neo4j.graphdb.GraphDatabaseService
import org.neo4j.cypher.ExecutionEngine

trait BanskyService extends Directives with CypherResultMarshallers {

  def neo4j:GraphDatabaseService
  lazy val cypher = new ExecutionEngine(neo4j)

  val discoService = {
    path("") {
      get {
        respondWithMediaType(`text/html`) {
          _.complete {
            <html>
              <head></head>
              <body>
                <h1>Speak softly, but carry a big can of paint.</h1>
                <p><a href="/shutdown?method=post">Shutdown</a> this server</p>
              </body>
            </html>
          }
        }
      }
    } ~
    path("shutdown") {
      (post | parameter('method ! "post")) { ctx =>
        Scheduler.scheduleOnce(() => Actor.registry.foreach(_ ! PoisonPill), 1000, TimeUnit.MILLISECONDS)
        ctx.complete("Will shutdown server in 1 second...")
      }
    } ~
    path("cypher") {
      post {
        content(as[String]) { cql =>
          parameter('method ! "post")
          completeWith(cypher.execute(cql))
        }
      }
    }
  }

}

