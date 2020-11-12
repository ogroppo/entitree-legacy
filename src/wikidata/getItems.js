import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import addEntityConnectors from "../lib/addEntityConnectors";
import getEntitiesFromWikidata from "./getEntitiesFromWikidata";

export default async function getItems(
  ids,
  languageCode,
  propId, // propId should go in options!!!
  options = {}
) {
  if (!ids || !ids.length) throw new Error("You need valid ids to getItems");

  const languages = DEFAULT_LANGS_CODES.concat(languageCode);

  if (options.secondLang) languages.push(options.secondLang.code);

  const allentities = await getEntitiesFromWikidata({
    ids,
    languages,
    props: ["labels", "descriptions", "claims", "sitelinks/urls"], // should go in options with default
  });

  const entities = await Promise.all(
    ids.map(async (id) => {
      let entity = await formatEntity(allentities[id], languageCode, options);
      //siblings and spouses don't need connectors, so no propId is passed
      if (propId && entity) {
        addEntityConnectors(entity, propId, options);
      }
      return entity;
    })
  );

  return entities;
}
