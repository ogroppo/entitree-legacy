export default function getNodeUniqueId(node, index, suffix = "") {
  let treeId = node.data.id + "-" + index;
  let parent = node.parent;
  while (parent) {
    treeId += "_" + parent.treeId;
    parent = parent.parent;
  }
  return treeId + suffix;
}
