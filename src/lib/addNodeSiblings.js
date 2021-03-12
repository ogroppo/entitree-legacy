import getItems from "../wikidata/getItems";
import getSiblingNode from "./getSiblingNode";
import { sortByBirthDate } from "./sortEntities";

export default async function addNodeSiblings({
  node,
  currentLang,
  theme,
  settings,
  secondLabel,
}) {
  let firstSibling;
  const entities = await getItems(
    node.data.leftIds,
    currentLang.code,
    null,
    theme,
    { secondLabel, rightEntityOption: settings.rightEntityOption }
  );
  sortByBirthDate(entities);
  entities.forEach((entity, index) => {
    const siblingNode = getSiblingNode(entity, index);
    siblingNode.depth = node.depth;
    siblingNode.virtualParent = node;
    siblingNode.parent = node.parent;
    const siblingIndex = node.parent.children.indexOf(node); //it will keep prepending to the node index
    node.parent.children.splice(siblingIndex, 0, siblingNode);
    if (!firstSibling) firstSibling = siblingNode;
  });
  return firstSibling;
}
