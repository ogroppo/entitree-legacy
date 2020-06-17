//Use this reducer at some point
export default function graphReducer(graph, { type, ...arg }) {
  switch (type) {
    case "expandNode":
      const node = arg;
      if (node._expanded) return graph;
      node._expanded = true;
      //has cached data
      if (node._children) {
        node.children = node._children;
        node._children = null;
      }
      graph.positionX = -node.x;
      graph.positionY = -node.y;
      return graph;
    case "collapseNode":
      const node = arg;
      if (!node._expanded) return graph;
      collapseNode(node);
      return graph;
    default:
      throw new Error("Unknown action type " + type);
  }
}

const collapseNode = (node) => {
  if (!node._expanded) return;
  node._expanded = false;
  node._children = node.children;
  node._children.forEach(collapseChild);
  node.children = null;
};
