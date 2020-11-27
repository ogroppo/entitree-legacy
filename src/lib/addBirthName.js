import { BIRTH_NAME_ID } from "../constants/properties";
import getBestClaim from "./getBestClaim";

export default function addBirthName(entity) {
  const claim = entity.claims[BIRTH_NAME_ID];

  if (claim) entity.birthName = getBestClaim(claim, "text");
}
