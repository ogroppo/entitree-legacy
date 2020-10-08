import { BIRTH_PLACE_ID } from "../constants/properties";
import getBestClaim from "./getBestClaim";

export default function addBirthPlaceId(entity) {
  const claim = entity.claims[BIRTH_PLACE_ID];

  if (claim) entity.birthPlaceId = getBestClaim(claim, "id");
}
