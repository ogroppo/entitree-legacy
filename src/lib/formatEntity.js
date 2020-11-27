//import formatDateClaim from "./formatDateClaim";
import addEntityImages from "../wikidata/addEntityImages";
import {
  BIRTH_DATE_ID,
  DEATH_DATE_ID,
  GENDER_ID,
  WEBSITE_ID,
  INSTANCE_OF_ID,
} from "../constants/properties";
import {
  HUMAN_MALE_ID,
  ANIMAL_FEMALE_ID,
  ANIMAL_MALE_ID,
  HUMAN_FEMALE_ID,
  HUMAN_ID,
} from "../constants/entities";
import wbk from "wikidata-sdk";
import getSocialMediaProps from "./getSocialMediaProps";
import addDescription from "./addDescription";
import addLabel from "./addLabel";
import addDeathDate from "./addDeathDate";
import addBirthDate from "./addBirthDate";
import addBirthPlaceId from "./addBirthPlaceId";
import addLifeSpan from "./addLifeSpan";
import addStartDate from "./addStartDate";
import addEndDate from "./addEndDate";
import addStartEndSpan from "./addStartEndSpan";
import addInceptionDate from "./addInceptionDate";
import addAbolishedDate from "./addAbolishedDate";
import addInceptionAbolishedSpan from "./addInceptionAbolishedSpan";
import addDeathPlaceId from "./addDeathPlaceId";
import addBirthName from "./addBirthName";
import addSecondLabel from "./addSecondLabel";

export default async function formatEntity(
  entity,
  languageCode,
  theme,
  options = {}
) {
  if (entity.missing !== undefined) return undefined;

  if (!entity) throw new Error("Entity is required");
  if (!languageCode) throw new Error("Language code missing");

  const simpleClaims = wbk.simplify.claims(entity.claims, {
    keepQualifiers: true,
  });

  let formattedEntity = {
    ...entity,
    simpleClaims,
  };

  addLabel(formattedEntity, languageCode);
  addSecondLabel(
    formattedEntity,
    options.secondLabel ? options.secondLabel.code : null
  );
  addDescription(formattedEntity, languageCode);

  addBirthDate(formattedEntity, languageCode);
  addDeathDate(formattedEntity, languageCode);
  // addIsInfantDeath(formattedEntity);
  addLifeSpan(formattedEntity);

  addBirthPlaceId(formattedEntity, languageCode);
  addDeathPlaceId(formattedEntity, languageCode);

  addStartDate(formattedEntity, languageCode);
  addEndDate(formattedEntity, languageCode);
  addStartEndSpan(formattedEntity);

  addInceptionDate(formattedEntity, languageCode);
  addAbolishedDate(formattedEntity, languageCode);
  addInceptionAbolishedSpan(formattedEntity);

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

  addBirthName(formattedEntity, languageCode);

  addWebsite(formattedEntity);

  addGender(formattedEntity);

  addIsHuman(formattedEntity);

  await addEntityImages(formattedEntity, languageCode, theme);

  return formattedEntity;
}

function addIsHuman(entity) {
  try {
    entity.isHuman = entity.simpleClaims[INSTANCE_OF_ID].some(
      ({ value }) => value === HUMAN_ID //add all other IDS of person subclass?
    );
  } catch (error) {}
}

function addIsInfantDeath(entity) {
  if (
    entity.simpleClaims[DEATH_DATE_ID] &&
    entity.simpleClaims[BIRTH_DATE_ID]
  ) {
    try {
      entity.isInfantDeath =
        parseInt(entity.simpleClaims[DEATH_DATE_ID][0].value.slice(0, 4)) -
          parseInt(entity.simpleClaims[BIRTH_DATE_ID][0].value.slice(0, 4)) <
        5;
    } catch (error) {}
  }
}

function addWebsite(entity) {
  try {
    entity.website = entity.simpleClaims[WEBSITE_ID][0].value;
  } catch (error) {}
}

function addGender(entity) {
  try {
    const genderId = entity.simpleClaims[GENDER_ID][0].value;
    if (genderId) {
      if (genderId === HUMAN_MALE_ID || genderId === ANIMAL_MALE_ID) {
        entity.gender = "male";
      } else if (
        genderId === HUMAN_FEMALE_ID ||
        genderId === ANIMAL_FEMALE_ID
      ) {
        entity.gender = "female";
      } else {
        entity.gender = "thirdgender";
      }
    }
  } catch (error) {}
}
