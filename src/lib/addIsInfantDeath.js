import { BIRTH_DATE_ID, DEATH_DATE_ID } from "../constants/properties";

export default function addIsInfantDeath(entity) {
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
