export default function filterSpouses(originNode) {
  //Remove spouses that are in the tree already
  let potentialSpouses = {};
  originNode.children.forEach(({ data: { id } }) => (potentialSpouses[id] = 1));

  originNode.children.forEach((child) => {
    if (child.data.rightIds)
      child.data.rightIds = child.data.rightIds.filter(
        (spouseId) => !potentialSpouses[spouseId]
      );
  });
}
