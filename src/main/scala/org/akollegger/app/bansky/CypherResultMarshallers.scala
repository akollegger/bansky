package org.akollegger.app.bansky

import cc.spray.typeconversion.{SimpleMarshaller, DefaultMarshallers}
import org.neo4j.cypher.ExecutionResult
import cc.spray.http.ContentType
import cc.spray.http.MediaTypes._

import cc.spray.json._
import org.neo4j.graphdb.Node

import scala.collection.JavaConversions._
import collection.mutable.ListBuffer

object CypherJsonProtocol extends DefaultJsonProtocol {
  implicit object ExecutionResultJsonFormat extends RootJsonFormat[ExecutionResult] {
    def write(er: ExecutionResult) = JsArray( er.map (row =>
      JsObject {
        row.map { case (col, value) => (col -> anyJson(value)) }(collection.breakOut).toList
      }).toList )
    def read(value: JsValue) = null
    def anyJson(value: Any) = value match {
      case n:Node => JsObject(nodeJson(n))
      case _ => JsString(value.toString)
    }
    def nodeJson(n:Node) = {
      val jsonified:ListBuffer[(String, JsValue)] = ListBuffer("id" -> JsNumber(n.getId))
      for ( k <- n.getPropertyKeys) {
         jsonified += (k -> JsString(n.getProperty(k).toString))
      }
      jsonified.toList
    }
  }
}

trait CypherResultMarshallers extends DefaultMarshallers with DefaultJsonProtocol {

  import CypherJsonProtocol._

  implicit object ExecutionResultMarshaller extends SimpleMarshaller[ExecutionResult] {
    val canMarshalTo = ContentType(`text/plain`) :: ContentType(`application/json`) :: Nil

    def marshal(value: ExecutionResult, contentType: ContentType) = contentType match {
      case x@ ContentType(`application/json`, _) => StringMarshaller.marshal(value.toJson.compactPrint, x)
      case x@ ContentType(`text/plain`, _) => StringMarshaller.marshal(value.dumpToString(), x)
      case _ => throw new IllegalArgumentException
    }
  }

}

