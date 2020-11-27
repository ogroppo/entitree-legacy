import formatEntity from "../lib/formatEntity";
import { DEFAULT_LANGS_CODES } from "../constants/langs";
import addEntityConnectors from "../lib/addEntityConnectors";
import getEntitiesFromWikidata from "./getEntitiesFromWikidata";

export default async function getItems(
  ids,
  languageCode,
  propId, // propId should go in options!!!
  theme,
  options = {}
) {
  if (!ids || !ids.length) throw new Error("You need valid ids to getItems");

  const languages = DEFAULT_LANGS_CODES.concat(languageCode);

  if (options.secondLabel) languages.push(options.secondLabel.code);

  const allentities = await getEntitiesFromWikidata({
    ids,
    languages,
    props: ["labels", "descriptions", "claims", "sitelinks/urls"], // should go in options with default
  });

  const entities = await Promise.all(
    ids.map(async (id) => {
      let entity = await formatEntity(
        allentities[id],
        languageCode,
        theme,
        options
      );
      //siblings and spouses don't need connectors, so no propId is passed
      if (propId && entity) {
        addEntityConnectors(entity, propId, options);
      }
      return entity;
    })
  );

  return entities;
}
