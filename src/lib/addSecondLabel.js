import { BIRTH_NAME_ID, NICKNAME_ID } from "../constants/properties";

export default function addSecondLabel(entity, languageCode) {
  if (!languageCode) return;
  const { labels, simpleClaims } = entity;
  if (!labels) return;
  if (languageCode === NICKNAME_ID) {
    if (simpleClaims[NICKNAME_ID]) {
      entity.secondLabel = simpleClaims[NICKNAME_ID][0].value;
    }
    return;
  }
  if (languageCode === BIRTH_NAME_ID) {
    if (simpleClaims[BIRTH_NAME_ID]) {
      entity.secondLabel = simpleClaims[BIRTH_NAME_ID][0].value;
    }
    return;
  }

  let labelObject = labels[languageCode];
  if (!labelObject) return;

  entity.secondLabel = labelObject.value;
}
