import axios from "axios";
import wdk from "wikidata-sdk";
import { DEFAULT_LANG } from "../constants/langs";

export default async function getItemProps(id, languageCode) {
  const url = await new Promise(function (resolve, reject) {
    try {
      const query = `SELECT DISTINCT ?claim ?claimLabel WHERE {
      BIND(wd:${id} as ?item)
      {
        ?item ?p ?statement.
        ?claim wikibase:claim ?p.
        ?claim wikibase:propertyType wikibase:WikibaseItem .
      } UNION {
        ?parent ?p ?statement.
        ?statement ?_ ?item .
        ?claim wikibase:claim ?p.
        ?claim wikibase:propertyType wikibase:WikibaseItem .
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "${languageCode}, ${DEFAULT_LANG.code}". }
    }`;

      const url = wdk.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });

  return axios
    .get(url)
    .then(({ data }) => wdk.simplify.sparqlResults(data))
    .then((results) => {
      let props = [];
      results.forEach(({ claim: { value: id, label } }) => {
        props.push({ id, label });
      });
      return props;
    });
}
