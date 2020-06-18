import getClaimIds from "./getClaimIds";
import formatDateClaim from "./formatDateClaim";
import addImagesFromClaims from "./../wikidata/images";

import {
  SIBLINGS_ID,
  SPOUSE_ID,
  BIRTH_DATE_ID,
  DEATH_DATE_ID,
  CHILD_ID,
} from "../constants/properties";
import wbk from "wikidata-sdk";
import getSocialMediaIcons from "./../wikidata/socialMediaIcons";

export default function formatEntity(entity, options = {}) {
  if (entity.missing !== undefined)
    throw new Error(`Entity ${entity.id} not found`);

  if (options.propId && options.withChildren !== false) {
    entity.childrenIds = getClaimIds(entity, options.propId);
  }

  const languages = options.languages || ["en"];
  entity.label = languages
    .map((lang) => (entity.labels[lang] ? entity.labels[lang].value : null))
    .filter((l) => l)
    .join(", ");

  entity.description = languages
    .map((lang) =>
      entity.descriptions[lang] ? entity.descriptions[lang].value : null
    )
    .filter((l) => l)
    .join(", ");

  entity.birthDate = formatDateClaim(entity.claims[BIRTH_DATE_ID]);
  entity.deathDate = formatDateClaim(entity.claims[DEATH_DATE_ID]);

  var claims = wbk.simplify.claims(entity.claims, { keepQualifiers: true});
  entity.html = getSocialMediaIcons(claims);

  if (options.propId === CHILD_ID) {
    entity.spouseIds = getClaimIds(entity, SPOUSE_ID);
    entity.siblingIds = getClaimIds(entity, SIBLINGS_ID);
  }

  // const images = entity.claims["P18"] || [];
  var images = addImagesFromClaims(claims);
  //({ mainsnak: { datavalue: { value } } }) =>
  entity.images = images.map( ({url, source}) => ({
    alt: url, //a lot of things could be done here from the qualifiers
    url: url,
  }));
}
