import { BIRTH_NAME_ID, NICKNAME_ID } from "../constants/properties";

export default function addSecondLangLabel(entity, languageCode) {
  if (!languageCode) return;
  const { labels, simpleClaims } = entity;
  if (!labels) return;
  if (languageCode === "nickname") {
    if (simpleClaims[NICKNAME_ID]) {
      entity.secondLangLabel = simpleClaims[NICKNAME_ID][0].value;
    }
    return;
  }
  if (languageCode === "birthName") {
    if (simpleClaims[BIRTH_NAME_ID]) {
      entity.secondLangLabel = simpleClaims[BIRTH_NAME_ID][0].value;
    }
    return;
  }

  let labelObject = labels[languageCode];
  if (!labelObject) return;

  entity.secondLangLabel = labelObject.value;
}
