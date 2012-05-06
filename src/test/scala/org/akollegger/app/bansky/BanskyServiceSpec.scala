package org.akollegger.app.bansky

import org.specs2.mutable._
import cc.spray._
import test._
import http._
import HttpMethods._
import StatusCodes._

class BanskyServiceSpec extends Specification with SprayTest with BanskyService {
  
  "The BanskyService" should {
    "return a greeting for GET requests to the root path" in {
      testService(HttpRequest(GET, "/")) {
        discoService
      }.response.content.as[String].right.get must contain("Say hello")
    }
    "leave GET requests to other paths unhandled" in {
      testService(HttpRequest(GET, "/kermit")) {
        discoService
      }.handled must beFalse
    }
    "return a MethodNotAllowed error for PUT requests to the root path" in {
      testService(HttpRequest(PUT, "/")) {
        discoService
      }.response mustEqual HttpResponse(MethodNotAllowed, "HTTP method not allowed, supported methods: GET")
    }
  }
  
}