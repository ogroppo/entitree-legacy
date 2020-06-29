import getClaimIds from "./getClaimIds";
import { SIBLINGS_ID, SPOUSE_ID } from "../constants/properties";

export default async function addEntityConnectors(
  entity,
  propId,
  options = {}
) {
  if (options.upMap) {
    if (!propId) throw new Error("propId needed");
    entity.upIds = options.upMap[entity.id];
  }
  if (options.withChildren) {
    if (!propId) throw new Error("propId needed");
    entity.downIds = getClaimIds(entity, propId);
  }
  if (options.withSpouses) entity.rightIds = getClaimIds(entity, SPOUSE_ID);
  if (options.withSiblings) entity.leftIds = getClaimIds(entity, SIBLINGS_ID);

  return entity;
}
