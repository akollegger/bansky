package org.akollegger.app.bansky

import org.slf4j.LoggerFactory
import cc.spray.{SprayCanRootService, HttpService}
import cc.spray.can.{ServerConfig, HttpServer}
import akka.actor.Actor._
import akka.actor.Supervisor
import akka.config.Supervision.{Permanent, Supervise, OneForOneStrategy, SupervisorConfig}
import org.neo4j.kernel.EmbeddedGraphDatabase
import sys.ShutdownHookThread

object Boot extends App {

  LoggerFactory.getLogger(getClass) // initialize SLF4J early

  val mainModule = new BanskyService {
    // bake your module cake here
    val neo4j = new EmbeddedGraphDatabase("bansky.graphdb")

    ShutdownHookThread({
      neo4j.shutdown()
    })
  }

  val host = "0.0.0.0"
  val port = Option(System.getenv("PORT")).getOrElse("5000").toInt

  val httpService    = actorOf(new HttpService(mainModule.banskyService))
  val rootService    = actorOf(new SprayCanRootService(httpService))
  val sprayCanServer = actorOf(new HttpServer(new ServerConfig(host = host, port = port)))

  Supervisor(
    SupervisorConfig(
      OneForOneStrategy(List(classOf[Exception]), 3, 100),
      List(
        Supervise(httpService, Permanent),
        Supervise(rootService, Permanent),
        Supervise(sprayCanServer, Permanent)
      )
    )
  )
}
