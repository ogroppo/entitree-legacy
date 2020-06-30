import axios from "axios";
import wdk from "wikidata-sdk";
import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import addEntityConnectors from "../lib/addEntityConnectors";

export async function getEntitiesFromWikidata({ ids, languages, props }) {
  if (ids.length === 0) {
    return [];
  }
  ids = ids.filter((id) => !!id); //delete undefined values

  //1 url for every 50 items
  const urls = await new Promise(function (resolve, reject) {
    try {
      if (!languages) throw new Error("languageCode Missing");
      resolve(
        wdk.getManyEntities({
          ids,
          languages,
          props,
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
  return allentities;
}

export default async function getItems(
  ids,
  languageCode,
  propId,
  options = {}
) {
  if (!ids || !ids.length) throw new Error("You need valid ids to getItems");

  const allentities = await getEntitiesFromWikidata({
    ids: ids,
    languages: [languageCode].concat(DEFAULT_LANGS_CODES),
    props: ["labels", "descriptions", "claims", "sitelinks/urls"],
  });

  const entities = await Promise.all(
    ids.map(async (id) => {
      let entity = await formatEntity(allentities[id], languageCode);
      //siblings and spouses don't need connectors, so no propId is passed
      if (propId) {
        entity = addEntityConnectors(entity, propId, options);
      }
      return entity;
    })
  );

  return entities;
}
