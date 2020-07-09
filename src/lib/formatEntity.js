import formatDateClaim from "./formatDateClaim";
import addEntityImages from "../wikidata/addEntityImages";
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
import addDescription from "./addDescription";
import addLabel from "./addLabel";

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

  addLabel(formattedEntity, languageCode);
  addDescription(formattedEntity, languageCode);

  //All the below should be conditional to the propId
  formattedEntity.birthDate = formatDateClaim(
    entity.claims[BIRTH_DATE_ID],
    languageCode
  );
  formattedEntity.deathDate = formatDateClaim(
    entity.claims[DEATH_DATE_ID],
    languageCode
  );

  formattedEntity.wikidataUrl = wbk.getSitelinkUrl({
    site: "wikidata",
    title: formattedEntity.id,
  });
  simpleClaims["wikidata"] = [{ value: formattedEntity.wikidataUrl }];

  if (entity.sitelinks && entity.sitelinks[languageCode + "wiki"]) {
    formattedEntity.sitelink = entity.sitelinks[languageCode + "wiki"];
    simpleClaims["wikipedia"] = [{ value: formattedEntity.sitelink.url }];

    formattedEntity.wikipediaSlug = formattedEntity.sitelink.url.split(
      "/wiki/"
    )[1];
  }

  formattedEntity.externalLinks = getSocialMediaProps(simpleClaims);

  formattedEntity.website =
    simpleClaims["P856"] && simpleClaims["P856"][0]
      ? simpleClaims["P856"][0].value
      : null;

  formattedEntity.gender = getGender(simpleClaims);

  await addEntityImages(formattedEntity, languageCode);

  return formattedEntity;
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
