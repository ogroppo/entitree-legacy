import formatDateClaim from "./formatDateClaim";
import { BIRTH_DATE_ID } from "../constants/properties";

export default function addBirthDate(entity, languageCode) {
  const claim = entity.claims[BIRTH_DATE_ID];
  if (claim) entity.birthDate = formatDateClaim(claim, languageCode);
}
