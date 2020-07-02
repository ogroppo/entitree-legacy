import formatDateClaim from "./formatDateClaim";
import getEntityImages from "../wikidata/getEntityImages";
import {
  BIRTH_DATE_ID,
  DEATH_DATE_ID,
  GENDER_ID,
} from "../constants/properties";
import {
  HUMAN_MALE_ID,
  ANIMAL_FEMALE_ID,
  ANIMAL_MALE_ID,
  HUMAN_FEMALE_ID,
} from "../constants/entities";
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
  formattedEntity.birthDate = formatDateClaim(
    entity.claims[BIRTH_DATE_ID],
    languageCode
  );
  formattedEntity.deathDate = formatDateClaim(
    entity.claims[DEATH_DATE_ID],
    languageCode
  );
  formattedEntity.externalLinks = getSocialMediaProps(simpleClaims);

  formattedEntity.gender = getGender(simpleClaims);

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

function getGender(simpleClaims) {
  let gender;
  try {
    gender = simpleClaims[GENDER_ID][0].value;
  } catch (error) {}

  if (gender) {
    if (gender === HUMAN_MALE_ID || gender === ANIMAL_MALE_ID) {
      return "male";
    } else if (gender === HUMAN_FEMALE_ID || gender === ANIMAL_FEMALE_ID) {
      return "female";
    } else {
      return "thirdgender";
    }
  }
}
