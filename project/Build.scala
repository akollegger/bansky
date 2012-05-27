import sbt._
import com.github.siasia._
import com.typesafe.startscript.StartScriptPlugin
import PluginKeys._
import Keys._

object Build extends sbt.Build {
  import Dependencies._

  lazy val myProject = Project("bansky", file("."))
    .settings(StartScriptPlugin.startScriptForClassesSettings: _*)
    .settings(
      organization  := "org.akollegger.app",
      version       := "0.0.1",
      scalaVersion  := "2.9.1",
      scalacOptions := Seq("-deprecation", "-encoding", "utf8"),
      resolvers     ++= Dependencies.resolutionRepos,
      libraryDependencies ++= Seq(
        Compile.akkaActor,
        Compile.parboiled,
        Compile.mimepull,
        Compile.sprayServer,
        Compile.sprayCan,
        Compile.sprayJson,
        Compile.neo4jGraph,
        Test.specs2,
        Container.akkaSlf4j,
        Container.slf4j,
        Container.logback
      )
    )
}

object Dependencies {
  val resolutionRepos = Seq(
    "Typesafe Repository" at "http://repo.typesafe.com/typesafe/releases/",
    "Spray Repository" at "http://repo.spray.cc",
    "Neo4j Snapshots" at "http://m2.neo4j.org/content/repositories/snapshots",
    ScalaToolsSnapshots
  )

  object V {
    val akka      = "1.3.1"
    val spray     = "0.9.0"
    val sprayCan  = "0.9.3"
    val sprayJson = "1.1.1"
    val parboiled = "1.0.2"
    val mimepull  = "1.6"
    val specs2    = "1.6.1"
    val slf4j     = "1.6.1"
    val logback   = "0.9.29"
    val neo4j     = "1.8.M03"
  }

  object Compile {
    val akkaActor   = "se.scalablesolutions.akka" %  "akka-actor"      % V.akka      % "compile"
    val parboiled   = "org.parboiled"             %  "parboiled-scala" % V.parboiled % "compile"
    val mimepull    = "org.jvnet"                 %  "mimepull"        % V.mimepull  % "compile"
    val sprayServer = "cc.spray"                  %  "spray-server"    % V.spray     % "compile"
    val sprayCan    = "cc.spray"                  %  "spray-can"       % V.sprayCan  % "compile"
    val sprayJson   = "cc.spray"                 %%  "spray-json"      % V.sprayJson % "compile"
    val neo4jGraph  = "org.neo4j"                 %  "neo4j"           % V.neo4j     % "compile"
  }

  object Test {
    val specs2      = "org.specs2"                %% "specs2"          % V.specs2  % "test"
  }

  object Container {
    val akkaSlf4j   = "se.scalablesolutions.akka" %  "akka-slf4j"      % V.akka
    val slf4j       = "org.slf4j"                 %  "slf4j-api"       % V.slf4j
    val logback     = "ch.qos.logback"            %  "logback-classic" % V.logback
  }
}
