import getClaimIds from "./getClaimIds";
import formatDateClaim from "./formatDateClaim";
import addEntityImagesFromSimpleClaims from "./addEntityImagesFromSimpleClaims";
import {
  SIBLINGS_ID,
  SPOUSE_ID,
  BIRTH_DATE_ID,
  DEATH_DATE_ID,
  CHILD_ID,
} from "../constants/properties";
import wbk from "wikidata-sdk";
import getSocialMediaProps from "./getSocialMediaProps";

export default function formatEntity(entity, options = {}) {
  if (entity.missing !== undefined)
    throw new Error(`Entity ${entity.id} not found`);

  const simpleClaims = wbk.simplify.claims(entity.claims, {
    keepQualifiers: true,
  });

  if (options.propId && options.withChildren !== false) {
    entity.childrenIds = getClaimIds(entity, options.propId);
  }

  const languages = options.languages || ["en"];
  entity.label = languages
    .map((langCode) =>
      entity.labels[langCode] ? entity.labels[langCode].value : null
    )
    .filter((l) => l)
    .join(", ");

  entity.description = languages
    .map((langCode) =>
      entity.descriptions[langCode] ? entity.descriptions[langCode].value : null
    )
    .filter((l) => l)
    .join(", ");

  entity.birthDate = formatDateClaim(entity.claims[BIRTH_DATE_ID]);
  entity.deathDate = formatDateClaim(entity.claims[DEATH_DATE_ID]);

  entity.externalLinks = getSocialMediaProps(simpleClaims);

  if (options.propId === CHILD_ID) {
    entity.spouseIds = getClaimIds(entity, SPOUSE_ID);
    entity.siblingIds = getClaimIds(entity, SIBLINGS_ID);
  }

  addEntityImagesFromSimpleClaims(entity, simpleClaims);
}
