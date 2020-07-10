import formatDateClaim from "./formatDateClaim";
import { START_DATE_ID } from "../constants/properties";

export default function addStartDate(entity, languageCode) {
  const claim = entity.claims[START_DATE_ID];
  if (claim) entity.startDate = formatDateClaim(claim, languageCode);
}
