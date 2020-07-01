import getClaimIds from "./getClaimIds";
import { SIBLINGS_ID, SPOUSE_ID, CHILD_ID } from "../constants/properties";
import getUpConnectors from "../wikidata/getUpConnectors";

export default async function addEntityConnectors(
  entities,
  languageCode,
  options = {}
) {
  if (options.withUpConnectors) {
    await getUpConnectors(entities, languageCode, options);
  }

  if (options.withDownConnectors) {
    //_entity.upConnectors = await getChildConnector(currentEntity.id, options.currentProp);
  }
  // if (options.currentProp && options.currentProp.id === CHILD_ID) {
  //   _entity.rightIds = getClaimIds(_entity, SPOUSE_ID);
  //   _entity.leftIds = getClaimIds(_entity, SIBLINGS_ID);
  // }
}
