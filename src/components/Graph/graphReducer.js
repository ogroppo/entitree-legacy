import treeLayout from "../../lib/getTreeLayout";
import { CARD_WIDTH, CARD_HEIGHT } from "../../constants/tree";

export const initialState = {
  positionX: 0,
  positionY: 0,
  scale: 1,
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

//Use this reducer at some point
export default function graphReducer(graph, { type, ...arg }) {
  switch (type) {
    case "set":
      return {
        ...initialState,
        ...arg,
      };
    case "expandChildren":
      var { node } = arg;
      expandChildren(node);
      if (node.isRoot) graph.root._childrenExpanded = true;
      recalcChildren(graph);
      return { ...graph };
    case "collapseChildren":
      var { node } = arg;
      collapseChildren(node);
      if (node.isRoot) graph.root._childrenExpanded = false;
      recalcChildren(graph);
      return { ...graph };
    case "expandParents":
      var { node } = arg;
      expandParents(node);
      recalcParents(graph);
      if (node.isRoot) graph.root._parentsExpanded = true;
      return { ...graph };
    case "collapseParents":
      var { node } = arg;
      collapseParents(node);
      if (node.isRoot) graph.root._parentsExpanded = false;
      recalcParents(graph);
      return { ...graph };
    case "expandSpouses":
      var { node } = arg;
      node._spousesExpanded = true;
      if (node.isChild) recalcChildren(graph);
      if (node.isParent) recalcParents(graph);
      return { ...graph };
    case "collapseSpouses":
      var { node } = arg;
      node._spousesExpanded = false;
      node.parent.children = node.parent.children.filter(
        (child) =>
          !(child.isSpouse && child.virtualParent.treeId === node.treeId)
      );
      if (node.isChild) recalcChildren(graph);
      if (node.isParent) recalcParents(graph);
      return { ...graph };
    case "expandSiblings":
      var { node } = arg;
      node._siblingsExpanded = true;
      if (node.isChild) recalcChildren(graph);
      if (node.isParent) recalcParents(graph);
      return { ...graph };
    case "collapseSiblings":
      var { node } = arg;
      node._siblingsExpanded = false;
      node.parent.children = node.parent.children.filter(
        (child) =>
          !(child.isSibling && child.virtualParent.data.id === node.data.id)
      );
      if (node.isChild) recalcChildren(graph);
      if (node.isParent) recalcParents(graph);
      return { ...graph };
    case "expandRootSpouses":
      var { root } = arg;
      root._spousesExpanded = true;
      if (root._spouses) root.spouses = root._spouses;
      calcBounds(graph);
      return { ...graph };
    case "collapseRootSpouses":
      var { root } = arg;
      root._spousesExpanded = false;
      root._spouses = root.spouses;
      root.spouses = null;
      calcBounds(graph);
      return { ...graph };
    case "collapseRootSiblings":
      var { root } = arg;
      root._siblingsExpanded = false;
      root._siblings = root.siblings;
      root.siblings = null;
      calcBounds(graph);
      return { ...graph };
    case "expandRootSiblings":
      var { root } = arg;
      root._siblingsExpanded = true;
      if (root._siblings) root.siblings = root._siblings;
      calcBounds(graph);
      return { ...graph };
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

const expandChildren = (node) => {
  if (node._childrenExpanded) return;
  node._childrenExpanded = true;
  //has cached data
  if (node._children) {
    node.children = node._children;
    node._children = null;
  }
};

const expandParents = (node) => {
  if (node._parentsExpanded) return;
  node._parentsExpanded = true;
  //has cached data
  if (node._parents) {
    node.children = node._parents;
    node._parents = null;
  }
};

const collapseChildren = (node, collapseAll = false) => {
  if (!node._childrenExpanded) return;
  node._childrenExpanded = false;
  node._children = node.children.filter((child) => child.isChild);
  node.children = null;

  //there is still some buggy behaviour here!
  if (collapseAll) {
    //node._siblings = node.siblings;
    node._siblingsExpanded = false;
    //node._spouses = node.spouses;
    node._spousesExpanded = false;
  }
  node._children.forEach((node) => collapseChildren(node, true));
};

const collapseParents = (node, collapseAll = false) => {
  if (!node._parentsExpanded) return;
  node._parentsExpanded = false;
  node._parents = node.children.filter((child) => child.isParent);
  node.children = null;

  //there is still some buggy behaviour here!
  if (collapseAll) {
    //node._siblings = node.siblings;
    node._siblingsExpanded = false;
    //node._spouses = node.spouses;
    node._spousesExpanded = false;
  }
  node._parents.forEach((node) => collapseParents(node, true));
};
