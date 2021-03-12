import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";

export default function getSpouseNode(entity, index) {
  const spouseNode = hierarchy(entity);
  spouseNode.isSpouse = true;
  spouseNode.treeId = getNodeUniqueId(spouseNode, index, "spouse");
  return spouseNode;
}
