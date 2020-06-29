import formatDateClaim from "./formatDateClaim";
import getEntityImages from "../wikidata/getEntityImages";
import { BIRTH_DATE_ID, DEATH_DATE_ID } from "../constants/properties";
import wbk from "wikidata-sdk";
import getSocialMediaProps from "./getSocialMediaProps";
import { DEFAULT_LANGS_CODES } from "../constants/langs";

export default async function formatEntity(entity, languageCode) {
  if (entity.missing !== undefined) return undefined;

  if (!languageCode) throw new Error("Language code missing");

  const simpleClaims = wbk.simplify.claims(entity.claims, {
    keepQualifiers: true,
  });

  let formattedEntity = {
    ...entity,
    simpleClaims,
  };

  formattedEntity.label = getLanguageString(entity.labels, languageCode);
  formattedEntity.description = getLanguageString(
    entity.descriptions,
    languageCode
  );

  //All the below should be conditional to the propId
  formattedEntity.birthDate = formatDateClaim(entity.claims[BIRTH_DATE_ID]);
  formattedEntity.deathDate = formatDateClaim(entity.claims[DEATH_DATE_ID]);
  formattedEntity.externalLinks = getSocialMediaProps(simpleClaims);

  formattedEntity.images = await getEntityImages(formattedEntity, languageCode);

  return formattedEntity;
}

function getLanguageString(array, languageCode) {
  let langString = array[languageCode];
  if (langString) return langString.value;

  for (let defaultLangCode of DEFAULT_LANGS_CODES) {
    let defaultLangString = array[defaultLangCode];
    if (defaultLangString) return defaultLangString.value;
  }
}
