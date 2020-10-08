import { DEATH_PLACE_ID } from "../constants/properties";
import getBestClaim from "./getBestClaim";

export default function addDeathPlaceId(entity) {
  const claim = entity.claims[DEATH_PLACE_ID];

  if (claim) entity.deathPlaceId = getBestClaim(claim, "id");
}
