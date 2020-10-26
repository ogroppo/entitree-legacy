import treeLayout from "../../lib/getTreeLayout";
import { CARD_WIDTH, CARD_HEIGHT } from "../../constants/tree";

export const initialState = {
  maxLeft: -CARD_WIDTH,
  maxRight: CARD_WIDTH,
  maxTop: -CARD_HEIGHT,
  maxBottom: CARD_HEIGHT,
  childNodes: [],
  childRels: [],
  parentNodes: [],
  parentRels: [],
  childTree: {},
  parentTree: {},
  containerStyle: {
    width: 2 * CARD_WIDTH,
    height: 2 * CARD_HEIGHT,
  },
  root: null,
};

export default function graphReducer(graph, { type, ...arg }) {
  //console.log({ type });
  switch (type) {
    case "set":
      return {
        ...initialState,
        ...arg,
      };
    case "expandChildren": {
      let { node } = arg;
      if (node._childrenExpanded) return graph; //no-op
      node._childrenExpanded = true;
      node.loadingChildren = false;
      if (node.isRoot) {
        graph.root._childrenExpanded = true;
        graph.root.loadingChildren = false;
      }
      recalcChildren(graph);
      return { ...graph };
    }
    case "collapseChildren": {
      let newGraph = { ...graph };
      let { node } = arg;
      node.loadingChildren = false;
      if (node.isRoot) {
        newGraph.root._childrenExpanded = false;
        newGraph.root.loadingChildren = false;
      }
      collapseChildren(node);
      recalcChildren(newGraph);
      return newGraph;
    }
    case "setLoadingChildren": {
      let { node } = arg;
      node.loadingChildren = true;
      if (node.isRoot) graph.root.loadingChildren = true;
      return { ...graph };
    }
    case "setLoadingParents": {
      let { node } = arg;
      node.loadingParents = true;
      if (node.isRoot) graph.root.loadingParents = true;
      return { ...graph };
    }
    case "expandParents": {
      let { node } = arg;
      if (node._parentsExpanded) return graph; //no-op
      node._parentsExpanded = true;
      node.loadingParents = false;
      if (node.isRoot) {
        //replicate on root
        graph.root._parentsExpanded = true;
        graph.root.loadingParents = false;
      }
      recalcParents(graph);
      return { ...graph };
    }
    case "collapseParents": {
      let { node } = arg;
      node.loadingParents = false;
      if (node.isRoot) {
        //replicate on root
        graph.root._parentsExpanded = false;
        graph.root.loadingParents = false;
      }
      collapseParents(node);
      recalcParents(graph);
      return { ...graph };
    }
    case "setLoadingSpouses": {
      let { node } = arg;
      node.loadingSpouses = true;
      return graph;
    }
    case "expandSpouses": {
      let { node } = arg;
      node._spousesExpanded = true;
      if (node._spouses) {
        const spouseIndex = node.parent.children.indexOf(node) + 1;
        node.parent.children.splice(spouseIndex, 0, ...node._spouses);
        node._spouses = null;
      }
      if (node.isChild) recalcChildren(graph);
      if (node.isParent) recalcParents(graph);
      node.loadingSpouses = false;
      return { ...graph };
    }
    case "collapseSpouses": {
      let newGraph = { ...graph };
      let { node } = arg;
      node._spousesExpanded = false;
      node.loadingSpouses = false;
      var spouses = [];
      var rest = [];
      node.parent.children.forEach((adjacent) => {
        if (adjacent.isSpouse && adjacent.virtualParent === node) {
          spouses.push(adjacent);
        } else {
          rest.push(adjacent);
        }
      });
      node._spouses = spouses;
      node.parent.children = rest;
      if (node.isChild) recalcChildren(newGraph);
      if (node.isParent) recalcParents(newGraph);
      return newGraph;
    }
    case "setLoadingSiblings": {
      let { node } = arg;
      node.loadingSiblings = true;
      return { ...graph };
    }
    case "expandSiblings": {
      let { node } = arg;
      node._siblingsExpanded = true;
      if (node._siblings) {
        const siblingIndex = node.parent.children.indexOf(node); //it will keep prepending to the node index
        node.parent.children.splice(siblingIndex, 0, ...node._siblings);
        node._siblings = null;
      }
      if (node.isChild) recalcChildren(graph);
      if (node.isParent) recalcParents(graph);
      node.loadingSiblings = false;
      return { ...graph };
    }
    case "collapseSiblings": {
      let newGraph = { ...graph };
      let { node } = arg;
      node._siblingsExpanded = false;
      node._siblings = node.parent.children.filter(
        (sibling) => sibling.isSibling && sibling.virtualParent === node
      );
      node.parent.children = node.parent.children.filter(
        (sibling) => !(sibling.isSibling && sibling.virtualParent === node)
      );
      if (node.isChild) recalcChildren(newGraph);
      if (node.isParent) recalcParents(newGraph);
      node.loadingSiblings = false;
      return newGraph;
    }
    case "expandRootSpouses": {
      let { root } = arg;
      root._spousesExpanded = true;
      if (root._spouses) root.spouses = root._spouses;
      calcBounds(graph);
      root.loadingSpouses = false;
      return { ...graph };
    }
    case "collapseRootSpouses": {
      let { root } = arg;
      root._spousesExpanded = false;
      root._spouses = root.spouses;
      root.spouses = null;
      calcBounds(graph);
      root.loadingSpouses = false;
      return { ...graph };
    }
    case "collapseRootSiblings": {
      let { root } = arg;
      root._siblingsExpanded = false;
      root._siblings = root.siblings;
      root.siblings = null;
      calcBounds(graph);
      root.loadingSiblings = false;
      return { ...graph };
    }
    case "expandRootSiblings": {
      let { root } = arg;
      root._siblingsExpanded = true;
      if (root._siblings) root.siblings = root._siblings;
      calcBounds(graph);
      root.loadingSiblings = false;
      return { ...graph };
    }
    default:
      throw new Error("Unknown action type " + type);
  }
}

const recalcChildren = (graph) => {
  treeLayout(graph.childTree);
  graph.childNodes = graph.childTree.descendants().slice(1);
  graph.childRels = graph.childTree.links();
  calcBounds(graph);
};

const recalcParents = (graph) => {
  treeLayout(graph.parentTree);
  graph.parentNodes = graph.parentTree.descendants().slice(1);
  graph.parentRels = graph.parentTree.links();
  calcBounds(graph);
};

const calcBounds = (graph) => {
  graph.maxRight = 0;
  graph.maxLeft = 0;
  graph.maxBottom = 0;
  graph.maxTop = 0;

  function compare(node) {
    if (node.x > 0 && node.x > graph.maxRight) graph.maxRight = node.x;
    if (node.x < 0 && node.x < graph.maxLeft) graph.maxLeft = node.x;
    if (node.y > 0 && node.y > graph.maxBottom) graph.maxBottom = node.y;
    if (node.y < 0 && node.y < graph.maxTop) graph.maxTop = node.y;
  }

  if (graph.root.siblings) graph.root.siblings.forEach(compare);
  if (graph.root.spouses) graph.root.spouses.forEach(compare);
  if (graph.parentNodes) graph.parentNodes.forEach(compare);
  if (graph.childNodes) graph.childNodes.forEach(compare);

  graph.containerStyle = {
    width: 2 * Math.max(Math.abs(graph.maxLeft), graph.maxRight) + CARD_WIDTH,
    height: 2 * Math.max(Math.abs(graph.maxTop), graph.maxBottom) + CARD_HEIGHT,
  };
};

const collapseChildren = (node) => {
  if (!node._childrenExpanded) return;
  node.children.forEach((child) => {
    if (child.isChild) {
      child._siblingsExpanded = false;
      child._spousesExpanded = false;
      node._children = node._children || [];
      node._children.push(child);
    }
    if (child.isSpouse) {
      child.virtualParent._spouses = child.virtualParent._spouses || [];
      child.virtualParent._spouses.push(child);
    }
    if (child.isSibling) {
      child.virtualParent._siblings = child.virtualParent._siblings || [];
      child.virtualParent._siblings.push(child);
    }
  });

  node.children = null;
  node._childrenExpanded = false;

  node._children.forEach((node) => collapseChildren(node));
};

const collapseParents = (node) => {
  if (!node._parentsExpanded) return;
  node.children.forEach((child) => {
    if (child.isParent) {
      child._siblingsExpanded = false;
      child._spousesExpanded = false;
      node._parents = node._parents || [];
      node._parents.push(child);
    }
    if (child.isSpouse) {
      child.virtualParent._spouses = child.virtualParent._spouses || [];
      child.virtualParent._spouses.push(child);
    }
    if (child.isSibling) {
      child.virtualParent._siblings = child.virtualParent._siblings || [];
      child.virtualParent._siblings.push(child);
    }
  });

  node.children = null;
  node._parentsExpanded = false;

  node._parents.forEach((node) => collapseParents(node));
};
