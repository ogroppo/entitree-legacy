import { BIRTH_DATE_ID, GENDER_ID } from "../constants/properties";
import getDateNumber from "./getDateNumber";
import { ANIMAL_MALE_ID, HUMAN_MALE_ID } from "../constants/entities";

/*
Sort entities by birth date, youngest child will be on the left, if birth date is unknown they will be on the left side
 */
export function sortByBirthDate(entities) {
  entities.sort((a, b) => {
    if (a.claims[BIRTH_DATE_ID] && b.claims[BIRTH_DATE_ID]) {
      return getDateNumber(
        a.claims[BIRTH_DATE_ID][0].mainsnak.datavalue.value.time
      ) >
        getDateNumber(b.claims[BIRTH_DATE_ID][0].mainsnak.datavalue.value.time)
        ? 1
        : -1;
    } else if (a.claims[BIRTH_DATE_ID]) {
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
