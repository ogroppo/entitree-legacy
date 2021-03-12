import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";

export default function getSiblingNode(entity, index) {
  const siblingNode = hierarchy(entity);
  siblingNode.isSibling = true;
  siblingNode.treeId = getNodeUniqueId(siblingNode, index, "sibling");
  return siblingNode;
}
