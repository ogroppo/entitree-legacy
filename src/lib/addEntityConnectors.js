import getClaimIds from "./getClaimIds";
import { SIBLINGS_ID, SPOUSE_ID, START_DATE_ID } from "../constants/properties";

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
  if (options.addRightIds) addRightIds(_entity);
  if (options.addLeftIds) _entity.leftIds = getClaimIds(_entity, SIBLINGS_ID);

  return _entity;
}

function addRightIds(entity) {
  const claim = entity.claims[SPOUSE_ID] || []; //cannot use simpleclaims here as only preferred will show up
  entity.rightIds = claim
    .sort((a, b) => {
      try {
        return a.qualifiers[START_DATE_ID][0].datavalue.value.time <
          b.qualifiers[START_DATE_ID][0].datavalue.value.time
          ? 1
          : -1;
      } catch (error) {
        return 1;
      }
    })
    .map(({ mainsnak }) => {
      try {
        return mainsnak.datavalue.value.id; //for 'No value' and 'Unknown'
      } catch (error) {
        return null;
      }
    })
    .filter((id) => id); //filter out 'No value' and 'Unknown'
}
