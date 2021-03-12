import { CHILD_ID } from "../constants/properties";
import getItems from "../wikidata/getItems";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { sortByBirthDate } from "./sortEntities";

export default async function addNodeChildren({
  currentLang,
  currentProp,
  node,
  secondLabel,
  settings,
  theme,
}) {
  const entities = await getItems(
    node.data.downIds,
    currentLang.code,
    currentProp.id,
    theme,
    {
      addDownIds: true,
      addRightIds: currentProp.id === CHILD_ID,
      secondLabel,
      rightEntityOption: settings.rightEntityOption,
    }
  );
  if (currentProp.id === CHILD_ID && !node.data.downIdsAlreadySorted) {
    sortByBirthDate(entities);
  }
  entities.forEach((entity, index) => {
    if (entity.isHuman && entity.isInfantDeath) return;
    const childNode = hierarchy(entity);
    childNode.depth = node.depth + 1;
    childNode.parent = node;
    childNode.childNumber = index + 1;
    childNode.treeId = getNodeUniqueId(childNode, index);
    childNode.isChild = true;
    if (!node.children) {
      node.children = [];
    }
    node.children.push(childNode);
  });
}
