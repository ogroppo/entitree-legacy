import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import addEntityConnectors from "../lib/addEntityConnectors";
import getEntitiesFromWikidata from "./getEntitiesFromWikidata";

export default async function getItems(
  ids,
  languageCode,
  propId,
  options = {}
) {
  if (!ids || !ids.length) throw new Error("You need valid ids to getItems");

  const languages = languageCode
    .concat(DEFAULT_LANGS_CODES)
    .filter(function (item) {
      return item !== 0;
    }); //.filter((x, i) => i === languageCode.indexOf(x))

  const allentities = await getEntitiesFromWikidata({
    ids: ids,
    languages: languages,
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
