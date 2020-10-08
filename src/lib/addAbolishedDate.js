import formatDateClaim from "./formatDateClaim";
import { DISSOLVED_ABOLISHED_DEMOLISHED_ID } from "../constants/properties";

export default function addAbolishedDate(entity, languageCode) {
  const claim = entity.claims[DISSOLVED_ABOLISHED_DEMOLISHED_ID];
  if (claim) entity.abolishedDate = formatDateClaim(claim, languageCode);
}
