import { CHILD_ID } from "../constants/properties";
import filterSpouses from "./filterSpouses";
import getItems from "../wikidata/getItems";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { sortByGender } from "./sortEntities";

export default async function addNodeParents({
  node,
  currentLang,
  currentProp,
  theme,
  currentUpMap,
  secondLabel,
}) {
  const entities = await getItems(
    node.data.upIds,
    currentLang.code,
    currentProp.id,
    theme,
    {
      upMap: currentUpMap,
      addLeftIds: currentProp.id === CHILD_ID,
      addRightIds: currentProp.id === CHILD_ID,
      secondLabel,
    }
  );
  if (currentProp.id === CHILD_ID) {
    sortByGender(entities);
  }
  entities.forEach((entity, index) => {
    const parentNode = hierarchy(entity);
    parentNode.isParent = true;
    parentNode.depth = node.depth - 1;
    parentNode.parent = node;
    parentNode.treeId = getNodeUniqueId(parentNode, index);
    if (!node.children) {
      node.children = [];
    }
    node.children.push(parentNode);
  });
  if (currentProp.id === CHILD_ID) {
    filterSpouses(node);
  }
}
