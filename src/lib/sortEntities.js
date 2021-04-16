import { BIRTH_DATE_ID, GENDER_ID } from "../constants/properties";
import getDateNumber from "./getDateNumber";
import { ANIMAL_MALE_ID, HUMAN_MALE_ID } from "../constants/entities";
import getSimpleClaimValue from "./getSimpleClaimValue";

/*
Sort entities by birth date, youngest child will be on the left, if birth date is unknown they will be on the left side
 */
export function sortByBirthDate(entities) {
  entities.sort((a, b) => {
    var valueA = getSimpleClaimValue(a.simpleClaims, BIRTH_DATE_ID);
    var valueB = getSimpleClaimValue(b.simpleClaims, BIRTH_DATE_ID);
    if (valueA && valueB) {
      return getDateNumber(valueA) > getDateNumber(valueB) ? 1 : -1;
    } else if (valueA) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function sortByGender(entities) {
  entities.sort((a, b) => {
    try {
      return a.claims[GENDER_ID][0].mainsnak.datavalue.value.id ===
        HUMAN_MALE_ID ||
        a.claims[GENDER_ID][0].mainsnak.datavalue.value.id === ANIMAL_MALE_ID
        ? -1
        : 1;
    } catch (error) {
      return -1;
    }
  });
}
