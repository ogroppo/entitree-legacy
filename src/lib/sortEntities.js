import {BIRTH_DATE_ID, GENDER_ID} from "../constants/properties";
import getDateNumber from "./getDateNumber";
import {HUMAN_MALE_ID} from "../constants/entities";
export function sortByBirthDate(entities) {
  entities.sort((a, b) => {
    try {
      return getDateNumber(
        a.claims[BIRTH_DATE_ID][0].mainsnak.datavalue.value.time
      ) >
        getDateNumber(b.claims[BIRTH_DATE_ID][0].mainsnak.datavalue.value.time)
        ? 1
        : -1;
    } catch (error) {
      return -1;
    }
  });
}


export function sortByGender(entities) {
  entities.sort((a, b) => {
    try {
      return a.claims[GENDER_ID][0].mainsnak.datavalue.value.id === HUMAN_MALE_ID ? -1 : 1;
    } catch (error) {
      return -1;
    }
  });
}
