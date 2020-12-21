import wdk from "wikidata-sdk";
import getData from "../axios/getData";

const cache = {};

export default async function getUpMap(id, propId) {
  const cacheKey = id + propId;
  let cacheEl = cache[cacheKey];
  if (cacheEl) {
    return cacheEl;
  }
  const query = `
  SELECT DISTINCT ?source ?target WHERE {
    SERVICE gas:service {
      gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP";
        gas:in wd:${id};
        gas:traversalDirection "Reverse" ;
        gas:out ?target;
        gas:out1 ?depth;
        gas:out2 ?source;
        gas:linkType wdt:${propId}.
    }
  }
  ORDER BY ?depth
  `.trim();

  //console.log(query);

  const url = wdk.sparqlQuery(query);

  return getData(url)
    .then((data) => wdk.simplify.sparqlResults(data).slice(1))
    .then((rows) => {
      let map = {};
      rows.forEach(({ source, target }) => {
        if (!map[source]) map[source] = [];
        //leave out lexemes
        if (target.startsWith("Q")) map[source].push(target);
      });

      cache[cacheKey] = map;
      return map;
    });
}

// function getDescendantsMap(id, propId) {
//   const query = `
//   SELECT DISTINCT ?source ?target WHERE {
//     SERVICE gas:service {
//       gas:program gas:gasClass "com.bigdata.rdf.graph.analytics.SSSP";
//         gas:in wd:${id};
//         gas:out ?target;
//         gas:out1 ?depth;
//         gas:out2 ?source;
//         gas:linkType wdt:${propId}.
//     }
//   }
//   ORDER BY ?depth
// `.trim();

//   //console.log(query);

//   const url = wdk.sparqlQuery(query);

//   return getData(url).then((data) => wdk.simplify.sparqlResults(data).slice(1));
// }
