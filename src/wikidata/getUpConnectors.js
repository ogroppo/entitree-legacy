import axios from "axios";
import wdk from "wikidata-sdk";
import { DEFAULT_LANG } from "../constants/langs";

export default async function getUpConnectors(entities, languageCode, options) {
  if (!Array.isArray(entities)) entities = [entities];

  const chunk = 100;
  let urls = [];
  for (let index = 0; index < entities.length; index += chunk) {
    urls.push(
      getQuery(entities.slice(index, index + chunk), languageCode, options)
    );
  }

  console.log(urls);

  //responses will be based on the number of urls generated
  const responses = await axios.all(
    urls
      .slice(0, 1)
      .map((url) =>
        axios.get(url).then(({ data }) => wdk.simplify.sparqlResults(data))
      )
  );

  //merge all rows
  let rows = responses.reduce((acc, curr) => acc.concat(curr), []);

  const connectorsMap = {};
  rows.forEach((row) => {
    if (row.parent.startsWith("Q")) {
      connectorsMap[row.item] = connectorsMap[row.item] || [];
      connectorsMap[row.item].push({
        id: row.parent,
        propId: row.prop.value,
        propLabel: row.prop.label,
      });
    }
  });
  entities.forEach((entity) => {
    entity.upConnectors = connectorsMap[entity.id];
  });
}

function getQuery(entities, languageCode, options) {
  const query = `
  SELECT DISTINCT ?item ?parent ?prop ?propLabel WHERE {
    VALUES ?item {${entities.map(({ id }) => `wd:${id}`).join(" ")}}
    ${options.currentProp ? `BIND(wdt:${options.currentProp.id} as ?p)` : ""}
    ?parent ?p ?item.
    ?prop wikibase:directClaim ?p.
    SERVICE wikibase:label { bd:serviceParam wikibase:language "${languageCode}, ${
    DEFAULT_LANG.code
  }". }
  }
  `.trim();

  const url = wdk.sparqlQuery(query);

  return url;
}
