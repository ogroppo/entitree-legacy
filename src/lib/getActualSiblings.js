export default function getActualSiblingsOrSpuses(node) {
  //Remove spouses and siblings that are in the tree already
  node.children.forEach((parentNode) => {
    parentNode.actualSpouseIds = parentNode.data.spouseIds.filter(
      (spouseId) => !node.children.find((p) => spouseId === p.data.id) //optimise with a map?
    );
    parentNode.actualSiblingIds = parentNode.data.siblingIds.filter(
      (siblingId) => !node.children.find((p) => siblingId === p.data.id) //optimise with a map?
    );
  });
}
