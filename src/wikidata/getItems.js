import axios from "axios";
import wdk from "wikidata-sdk";
import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANG } from "../constants/langs";
import addEntityConnectors from "../lib/addEntityConnectors";


export async function getEntitiesFromWikidata(para) {

  if(para.ids.length === 0){
    return [];
  }
  para.ids = para.ids.filter(item => !!item);//delete undefined values

  //1 url for every 50 items
  const urls = await new Promise(function (resolve, reject) {
    try {
      if (!para.langauges) throw new Error("languageCode Missing");
      resolve(
        wdk.getManyEntities({
          ids: para.ids,
          languages: para.langauges,
          props: para.props || [ 'labels', 'descriptions', 'claims', 'sitelinks/urls' ], // returns all data if not specified
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

  const allentities = await getEntitiesFromWikidata({
    ids: ids,
    langauges: [languageCode].concat(DEFAULT_LANG.code),
    props: ["labels", "descriptions", "claims", "sitelinks/urls"],
  });

  const entities = ids.map((id) => {
    let entity = formatEntity(allentities[id], languageCode);
    //siblings and spouses don't need connectors, so no propId is passed
    if (propId) {
      entity = addEntityConnectors(entity, propId, options);
    }
    return entity;
  });

  return entities;
}

export async function getLabels(
  ids,
  languageCode,
) {

  const allentities = await getEntitiesFromWikidata({
    ids: ids,
    langauges: [languageCode].concat(DEFAULT_LANG.code),
    props: ["labels"],
  });
  return allentities;
}