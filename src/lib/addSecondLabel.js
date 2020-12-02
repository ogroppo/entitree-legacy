import { BIRTH_NAME_ID, NICKNAME_ID } from "../constants/properties";
import getSimpleClaimValue from "./getSimpleClaimValue";

export default function addSecondLabel(entity, propCode) {
  if (!propCode) return;
  const { labels, simpleClaims } = entity;
  if (!propCode) return;
  if (propCode === NICKNAME_ID) {
    const nickname = getSimpleClaimValue(simpleClaims, NICKNAME_ID);
    if (nickname) {
      entity.secondLabel = nickname;
    }
    return;
  }
  if (propCode === BIRTH_NAME_ID) {
    const birthName = getSimpleClaimValue(simpleClaims, BIRTH_NAME_ID);
    if (birthName) {
      entity.secondLabel = birthName;
    }
    return;
  }

  let labelObject = labels[propCode];
  if (!labelObject) return;

  entity.secondLabel = labelObject.value;
}
