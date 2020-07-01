import formatDateClaim from "./formatDateClaim";
import getEntityImages from "../wikidata/getEntityImages";
import {
  BIRTH_DATE_ID,
  DEATH_DATE_ID,
  GENDER_ID,
} from "../constants/properties";
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

  let className = null;
  if (simpleClaims[GENDER_ID]) {
    var gender_id = parseInt(simpleClaims[GENDER_ID][0].value.substr(1));
    if (gender_id === 6581097 || gender_id === 44148) {
      // sortValue=0;
      // gender_html = '<i class="fa fa-mars"></i>';
      className = "node-male";
    } else if (gender_id === 6581072 || gender_id === 43445) {
      // sortValue = 1;
      // gender_html = '<i class="fa fa-venus"></i>';
      className = "node-female";
    } else {
      className = "node-thirdgender";
    }
  }
  formattedEntity.extraClass = className;

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
