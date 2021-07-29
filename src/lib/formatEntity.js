//import formatDateClaim from "./formatDateClaim";
import addEntityImages from "../wikidata/addEntityImages";
import {
  GENDER_ID,
  WEBSITE_ID,
  INSTANCE_OF_ID,
  FANDOM_ARTICLE_ID,
} from "../constants/properties";
import {
  HUMAN_MALE_ID,
  ANIMAL_FEMALE_ID,
  ANIMAL_MALE_ID,
  HUMAN_FEMALE_ID,
  HUMAN_ID,
  FICTIONAL_HUMAN_ID,
} from "../constants/entities";
import wbk from "wikidata-sdk";
import addExternalLinks from "./addExternalLinks";
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

  //todo: move to addWikidataUrl()
  formattedEntity.wikidataUrl = wbk.getSitelinkUrl({
    site: "wikidata",
    title: formattedEntity.id,
  });

  //todo: move to addWikipediaUrl()
  if (entity.sitelinks && entity.sitelinks[languageCode + "wiki"]) {
    formattedEntity.sitelink = entity.sitelinks[languageCode + "wiki"];
    formattedEntity.wikipediaUrl = formattedEntity.sitelink.url;
    formattedEntity.wikipediaSlug = formattedEntity.wikipediaUrl.split(
      "/wiki/"
    )[1];
  }
  if (
    entity.sitelinks["enwiki"] &&
    simpleClaims[INSTANCE_OF_ID] &&
    simpleClaims[INSTANCE_OF_ID][0].value === HUMAN_ID &&
    !entity.sitelinks["enwiki"].title.includes("(") //peoplePill uses a counter for same names
  ) {
    //TODO: check for foreign characters
    formattedEntity.peoplepillSlug = entity.sitelinks["enwiki"].title
      .toLowerCase()
      .replaceAll(" ", "-")
      .replaceAll(",", "")
      .replaceAll(".", "")
      .replaceAll("ñ", "n");

    //web archive will redirect to last cached version
    formattedEntity.peoplepillImageUrl =
      "https://web.archive.org/web/20220210233602if_/https://peoplepill.com/media/people/thumbs/" +
      formattedEntity.peoplepillSlug.substr(0, 1).toUpperCase() +
      "/" +
      formattedEntity.peoplepillSlug +
      ".jpg";
  }

  if (
    // fandom articles may have fictional animal or other instance
    // simpleClaims[INSTANCE_OF_ID] &&
    // simpleClaims[INSTANCE_OF_ID][0].value === FICTIONAL_HUMAN_ID &&
    simpleClaims[FANDOM_ARTICLE_ID] &&
    simpleClaims[FANDOM_ARTICLE_ID][0].value
  ) {
    const englishArticle = simpleClaims[FANDOM_ARTICLE_ID].find(
      (entry) =>
        entry.qualifiers &&
        entry.qualifiers.P407 &&
        entry.qualifiers.P407[0] === "Q1860"
    );
    if (englishArticle) {
      simpleClaims[FANDOM_ARTICLE_ID][0] = englishArticle;
    }
    const fandomId = simpleClaims[FANDOM_ARTICLE_ID][0].value.split(":");
    formattedEntity.fandomHost = fandomId[0];
    formattedEntity.fandomId = fandomId[1];
    formattedEntity.fandomUrl = `https://${formattedEntity.fandomHost}.fandom.com/wiki/${formattedEntity.fandomId}`;
  }

  addExternalLinks(formattedEntity);

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
      ({ value }) => value === HUMAN_ID || value === FICTIONAL_HUMAN_ID
    );
  } catch (error) {}
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
