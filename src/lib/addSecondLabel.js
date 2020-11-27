import { BIRTH_NAME_ID, NICKNAME_ID } from "../constants/properties";

export default function addSecondLabel(entity, propCode) {
  if (!propCode) return;
  const { labels, simpleClaims } = entity;
  if (!propCode) return;
  if (propCode === NICKNAME_ID) {
    if (simpleClaims[NICKNAME_ID]) {
      entity.secondLabel = simpleClaims[NICKNAME_ID][0].value;
    }
    return;
  }
  if (propCode === BIRTH_NAME_ID) {
    if (simpleClaims[BIRTH_NAME_ID]) {
      entity.secondLabel = simpleClaims[BIRTH_NAME_ID][0].value;
    }
    return;
  }

  let labelObject = labels[propCode];
  if (!labelObject) return;

  entity.secondLabel = labelObject.value;
}
