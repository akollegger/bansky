Disco Down to Distro Town
=========================

A simple download distribution server.


# Dependencies

- Requires sbt 0.11.1 to build.

# How to run

Clone this repository, then run the application in one of the following ways.

- Locally using sbt

        $ sbt clean compile run
        ...
        [success] Total time: 14 s, completed Jan 11, 2012 10:22:02 PM
        [info] Running cc.spray.examples.spraycan.Boot 
        01/11 22:22:03 INFO [run-main] c.s.c.HttpServer - Starting spray-can HTTP server on /0.0.0.0:8080
        01/11 22:22:03 INFO [akka:event-driven:dispatcher:event:handler-1] a.e.s.Slf4jEventHandler - 
              [cc.spray.HttpService]
              [HTTP Service started]
        01/11 22:22:03 INFO [akka:event-driven:dispatcher:event:handler-5] a.e.s.Slf4jEventHandler - 
              [cc.spray.SprayCanRootService]
              [spray RootService started]

- Locally using foreman (simulates Heroku)

        $ sbt clean compile stage
        ...
        [success] Total time: 14 s, completed Jan 11, 2012 10:23:31 PM
        [info] Wrote start script for mainClass := Some(cc.spray.examples.spraycan.Boot) to /home/laufer/Work/GitHub/spray-template-heroku/target/start
        [success] Total time: 0 s, completed Jan 11, 2012 10:23:31 PM

        $ foreman start
        22:24:17 web.1     | started with pid 25464
        22:24:18 web.1     | 01/11 22:24:18 INFO [main] c.s.c.HttpServer - Starting spray-can HTTP server on /0.0.0.0:5000
        22:24:18 web.1     | 01/11 22:24:18 INFO [akka:event-driven:dispatcher:event:handler-4] a.e.s.Slf4jEventHandler - 
        22:24:18 web.1     | 	   [cc.spray.HttpService]
        22:24:18 web.1     | 	   [HTTP Service started]
        22:24:19 web.1     | 01/11 22:24:19 INFO [akka:event-driven:dispatcher:event:handler-6] a.e.s.Slf4jEventHandler - 
        22:24:19 web.1     | 	   [cc.spray.SprayCanRootService]
        22:24:19 web.1     | 	   [spray RootService started]

- On Heroku

    [These instructions](http://devcenter.heroku.com/articles/scala#deploy_to_herokucedar) should
    work out of the box. The last few lines of the output should look like this.

               [success] Total time: 0 s, completed Jan 12, 2012 4:31:05 AM
        -----> Discovering process types
               Procfile declares types -> web
        -----> Compiled slug size is 37.1MB
        -----> Launching... done, v5
               http://quiet-samurai-5737.herokuapp.com deployed to Heroku
        
        To git@heroku.com:quiet-samurai-5737.git
         * [new branch]      master -> master

    Now you can connect to the app URL `http://quiet-samurai-5737.herokuapp.com` *on port 80*. 
    There is an internal port that varies across invocations of the app, but the app 
    is always exposed on port 80.
