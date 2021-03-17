import getItems from "../wikidata/getItems";
import getSpouseNode from "./getSpouseNode";

export default async function addNodeSpouses({
  node,
  currentLang,
  theme,
  settings,
  secondLabel,
}) {
  let lastSpouse;
  const entities = await getItems(
    node.data.rightIds,
    currentLang.code,
    null,
    theme,
    { secondLabel, rightEntityOption: settings.rightEntityOption }
  );
  entities.forEach((entity, index) => {
    const spouseNode = getSpouseNode(entity, index);
    spouseNode.depth = node.depth;
    spouseNode.virtualParent = node;
    spouseNode.parent = node.parent;
    const spouseIndex = node.parent.children.indexOf(node) + 1 + index; //need to be appended to the list
    node.parent.children.splice(spouseIndex, 0, spouseNode);
    lastSpouse = spouseNode;
  });
  return lastSpouse;
}
