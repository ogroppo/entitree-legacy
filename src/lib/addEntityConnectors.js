import getClaimIds from "./getClaimIds";
import { SIBLINGS_ID, SPOUSE_ID } from "../constants/properties";

export default function addEntityConnectors(entity, propId, options = {}) {
  let _entity = { ...entity };

  if (options.upMap) {
    if (!propId) throw new Error("propId needed");
    _entity.upIds = options.upMap[_entity.id];
  }
  if (options.addDownIds) {
    if (!propId) throw new Error("propId needed");
    _entity.downIds = getClaimIds(_entity, propId);
  }
  if (options.addRightIds) _entity.rightIds = getClaimIds(_entity, SPOUSE_ID);
  if (options.addLeftIds) _entity.leftIds = getClaimIds(_entity, SIBLINGS_ID);

  return _entity;
}
