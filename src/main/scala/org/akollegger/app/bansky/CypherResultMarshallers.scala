package org.akollegger.app.bansky

import cc.spray.typeconversion.{SimpleMarshaller, DefaultMarshallers}
import org.neo4j.cypher.ExecutionResult
import cc.spray.http.ContentType
import cc.spray.http.MediaTypes._

import cc.spray.json._

import scala.collection.JavaConversions._
import collection.mutable.ListBuffer
import org.neo4j.graphdb.{Path, Relationship, Node}

object CypherJsonProtocol extends DefaultJsonProtocol {

  implicit object ExecutionResultJsonFormat extends RootJsonFormat[ExecutionResult] {

    def write(er: ExecutionResult) = JsArray(er.map(row =>
      JsObject {
        row.map {
          case (col, value) => (col -> anyJson(value))
        }(collection.breakOut).toList
      }).toList)

    def read(value: JsValue) = null

    def anyJson(value: Any):JsValue = value match {
      case n: Node => JsObject(nodeJson(n))
      case r: Relationship => JsObject(relationshipJson(r))
      case p: Path => JsArray(p.map(anyJson(_)).toList)
      case _ => JsString(value.toString)
    }

    def nodeJson(n: Node) = {
      val jsonified: ListBuffer[(String, JsValue)] = ListBuffer("_id" -> JsNumber(n.getId))
      for (k <- n.getPropertyKeys) {
        jsonified += (k -> JsString(n.getProperty(k).toString))
      }
      jsonified.toList
    }

    def relationshipJson(r: Relationship) = {
      val jsonified: ListBuffer[(String, JsValue)] = ListBuffer(
        "_id" -> JsNumber(r.getId),
        "_type" -> JsString(r.getType.toString),
        "_start" -> JsNumber(r.getStartNode.getId),
        "_end" -> JsNumber(r.getEndNode.getId)
      )
      for (k <- r.getPropertyKeys) {
        jsonified += (k -> JsString(r.getProperty(k).toString))
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
      case x@ContentType(`application/json`, _) => StringMarshaller.marshal(value.toJson.compactPrint, x)
      case x@ContentType(`text/plain`, _) => StringMarshaller.marshal(value.dumpToString(), x)
      case _ => throw new IllegalArgumentException
    }
  }

}

