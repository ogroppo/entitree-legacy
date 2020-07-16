import formatDateClaim from "./formatDateClaim";
import { INCEPTION_ID } from "../constants/properties";

export default function addInceptionDate(entity, languageCode) {
  const claim = entity.claims[INCEPTION_ID];
  if (claim) entity.inceptionDate = formatDateClaim(claim, languageCode);
}
