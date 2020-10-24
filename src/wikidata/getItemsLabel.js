import { DEFAULT_LANGS_CODES } from "../constants/langs";
import addLabel from "../lib/addLabel";
import getEntitiesFromWikidata from "./getEntitiesFromWikidata";

export default async function getItemsLabel(ids, languageCode) {
  if (!ids || !ids.length)
    throw new Error("You need valid ids to getItemsLabel");

  const allentities = await getEntitiesFromWikidata({
    ids,
    languages: [languageCode].concat(DEFAULT_LANGS_CODES),
    props: ["labels"],
  });

  const entities = ids.map((id) => {
    let entity = allentities[id];
    if (entity) {
      addLabel(entity, languageCode);
      return entity.label;
    }
    return undefined;
  });

  return entities;
}
