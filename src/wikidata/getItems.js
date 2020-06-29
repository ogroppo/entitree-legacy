import axios from "axios";
import wdk from "wikidata-sdk";
import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANG } from "../constants/langs";
import addEntityConnectors from "../lib/addEntityConnectors";

export default async function getItems(
  ids,
  languageCode,
  propId,
  options = {}
) {
  //1 url for every 50 items
  const urls = await new Promise(function (resolve, reject) {
    try {
      if (!languageCode) throw new Error("languageCode Missing");
      resolve(
        wdk.getManyEntities({
          ids,
          languages: [languageCode].concat(DEFAULT_LANG.code),
          props: ["labels", "descriptions", "claims", "sitelinks/urls"],
        })
      );
    } catch (error) {
      reject(error);
    }
  });

  //responses will be based on the number of urls generated
  const responses = await axios.all(urls.map((url) => axios.get(url)));

  //merge all responses in one object
  let allentities = {};
  responses.forEach(
    ({ data: { entities } }) =>
      (allentities = {
        ...allentities,
        ...entities,
      })
  );

  const entities = ids.map((id) => {
    const entity = formatEntity(allentities[id], languageCode);
    if (propId) {
      //siblings and spouses don't need connectors
      addEntityConnectors(entity, propId, options);
    }
    return entity;
  });

  return entities;
}
