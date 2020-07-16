import formatDateClaim from "./formatDateClaim";
import { END_DATE_ID } from "../constants/properties";

export default function addEndDate(entity, languageCode) {
  const claim = entity.claims[END_DATE_ID];
  if (claim) entity.endDate = formatDateClaim(claim, languageCode);
}
