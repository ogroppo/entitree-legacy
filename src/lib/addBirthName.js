import { BIRTH_NAME } from "../constants/properties";
import getBestClaim from "./getBestClaim";

export default function addBirthName(entity) {
  const claim = entity.claims[BIRTH_NAME];

  if (claim) entity.birthName = getBestClaim(claim, "text");
}
