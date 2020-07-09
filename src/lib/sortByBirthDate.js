import { BIRTH_DATE_ID } from "../constants/properties";
import getDateNumber from "./getDateNumber";
export default function sortByBirthDate(entities) {
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
