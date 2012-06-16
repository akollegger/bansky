package org.akollegger.app.bansky

import cc.spray.http.MediaTypes._

import akka.actor.{PoisonPill, Actor, Scheduler}
import java.util.concurrent.TimeUnit
import org.neo4j.graphdb.GraphDatabaseService
import org.neo4j.cypher.ExecutionEngine
import cc.spray.{ValidationRejection, Directives}
import cc.spray.http.{StatusCode, StatusCodes, HttpResponse}

trait BanskyService extends Directives with CypherResultMarshallers {

  def neo4j: GraphDatabaseService

  lazy val cypher = new ExecutionEngine(neo4j)

  val banskyService = {
    path("shutdown") {
      (post | parameter('method ! "post")) {
        ctx =>
          Scheduler.scheduleOnce(() => Actor.registry.foreach(_ ! PoisonPill), 1000, TimeUnit.MILLISECONDS)
          ctx.complete("Will shutdown server in 1 second...")
      }
    } ~
      path("cypher") {
        post {
          content(as[String]) {
            cql =>
              parameter('method ! "post")
              detach {
                try {
                    val cypherResult= cypher.execute(cql)
                    completeWith(cypherResult)
                  } catch {
                    case e: Exception =>  completeWith(HttpResponse(StatusCodes.BadRequest, e.getMessage))
                  }
              }
          }
        }
      } ~
      path("") {
        getFromResource("WEB-INF/index.html")
      } ~
      pathPrefix("") {
        getFromResourceDirectory("WEB-INF/")
      }
  }

}

