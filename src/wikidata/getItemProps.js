import wdk from "wikidata-sdk";
import { DEFAULT_LANG } from "../constants/langs";
import getData from "../axios/getData";

export default async function getItemProps(id, languageCode) {
  const url = await new Promise(function (resolve, reject) {
    try {
      const query = `
      SELECT DISTINCT ?prop ?propLabel WHERE {
        BIND(wd:${id} as ?item)
        {
          ?item ?p ?child.
          ?prop wikibase:claim ?p;
            wikibase:propertyType wikibase:WikibaseItem.
        }
        UNION
        {
          ?parent ?p ?item.
          ?prop wikibase:directClaim ?p.
          MINUS { ?parent rdf:type ?pt. }
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "${languageCode}, ${DEFAULT_LANG.code}". }
      }`.trim();

      const url = wdk.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });

  return getData(url)
    .then((data) => wdk.simplify.sparqlResults(data))
    .then((results) => {
      const props = results.map(({ prop: { value: id, label } }) => ({
        id,
        label,
      }));
      return props;
    });
}
