import wdk from "wikidata-sdk";
import getData from "../axios/getData";

export async function getSparql(query) {
  const url = wdk.sparqlQuery(query);

  return getData(url).then(function (response) {
    return wdk.simplify.sparqlResults(response, { minimize: false });
  });
}

export default async function bidirectionalQuery() {
  return await getSparql(createForwardQuery("Q9682"));
}

function createBiQuery(id) {
  return `PREFIX gas: <http://www.bigdata.com/rdf/gas#>
  SELECT ?item ?itemLabel ?linkTo {
  { SERVICE gas:service {
  gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
  gas:in wd:${id};
  gas:traversalDirection "Forward" ;
  gas:out ?item ;
  gas:out1 ?depth ;
  gas:maxVisited 2 ;
  gas:linkType wdt:P40 .
} } UNION { SERVICE gas:service {
  gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
  gas:in wd:${id} ;
  gas:traversalDirection "Reverse" ;
  gas:out ?item ;
  gas:out1 ?depth ;
  gas:maxVisited 4 ;
  gas:linkType wdt:P40 .
} }
  OPTIONAL { ?item wdt:P279 ?linkTo }
  SERVICE wikibase:label {bd:serviceParam wikibase:language "en" }
}`;
}
function createForwardQuery(id) {
  return `SELECT ?item ?itemLabel ?linkTo {
      SERVICE gas:service {
        gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP" ;
                gas:in wd:${id};
                gas:traversalDirection "Forward" ;
                gas:out ?item ;
                gas:out1 ?depth ;
                gas:maxVisited 4 ;
                gas:linkType wdt:P171 .
  }
  OPTIONAL { ?item wdt:P171 ?linkTo }
  SERVICE wikibase:label {bd:serviceParam wikibase:language "en" }
}`;
}
