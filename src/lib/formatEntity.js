import getClaimIds from "./getClaimIds";
import formatDateClaim from "./formatDateClaim";
import getEntityImagesFromSimpleClaims from "../wikidata/getEntityImagesFromSimpleClaims";
import {
  SIBLINGS_ID,
  SPOUSE_ID,
  BIRTH_DATE_ID,
  DEATH_DATE_ID,
  CHILD_ID,
  FATHER_ID,
  MOTHER_ID,
} from "../constants/properties";
import wbk from "wikidata-sdk";
import getSocialMediaProps from "./getSocialMediaProps";
import { DEFAULT_LANG } from "../constants/langs";

export default function formatEntity(entity, languageCode) {
  if (entity.missing !== undefined) return undefined;

  if (!languageCode) throw new Error("Language code missing");

  const simpleClaims = wbk.simplify.claims(entity.claims, {
    keepQualifiers: true,
  });

  let formattedEntity = {
    ...entity,
    simpleClaims,
  };

  formattedEntity.label = entity.labels[languageCode]
    ? entity.labels[languageCode].value
    : entity.labels[DEFAULT_LANG.code]
    ? entity.labels[DEFAULT_LANG.code].value
    : undefined;

  formattedEntity.description = entity.descriptions[languageCode]
    ? entity.descriptions[languageCode].value
    : entity.descriptions[DEFAULT_LANG.code]
    ? entity.descriptions[DEFAULT_LANG.code].value
    : undefined;

  //All the below should be conditional to the propId
  formattedEntity.birthDate = formatDateClaim(entity.claims[BIRTH_DATE_ID]);
  formattedEntity.deathDate = formatDateClaim(entity.claims[DEATH_DATE_ID]);
  formattedEntity.externalLinks = getSocialMediaProps(simpleClaims);

  formattedEntity.images = getEntityImagesFromSimpleClaims(simpleClaims);

  return formattedEntity;
}
