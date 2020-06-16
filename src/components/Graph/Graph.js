import React, { useReducer } from "react";
import { getItem, getItems } from "../../lib/api";
import "./Graph.scss";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { tree as d3Tree, hierarchy } from "d3-hierarchy";
import {
  CARD_OUTER_WIDTH,
  CARD_VERTICAL_SPACING,
  CARD_HEIGHT,
  CARD_WIDTH,
  SIBLING_SPOUSE_SEPARATION,
  SAME_GROUP_SEPARATION,
} from "../../constants/tree";
import Node from "../Node/Node";
import Rel from "../Rel/Rel";
import { CHILD_ID } from "../../constants/properties";
import rootReducer from "./rootReducer";

const treeLayout = d3Tree();
treeLayout.nodeSize([CARD_OUTER_WIDTH, CARD_VERTICAL_SPACING]);
treeLayout.separation((a, b) => {
  if (!b.isSpouse && a.isSpouse) return SIBLING_SPOUSE_SEPARATION;
  //if (a.isSpouse && b.isSpouse) return 0.5;

  if (!a.isSibling && b.isSibling) return SIBLING_SPOUSE_SEPARATION;
  //if (a.isSibling && b.isSibling) return 0.5;

  if (a.parent === b.parent) return SAME_GROUP_SEPARATION;

  if (a.parent !== b.parent) return 1.4;
});

export default function Graph({ showError, currentEntityId, currentPropId }) {
  const [positionX, setPositionX] = React.useState(0);
  const [positionY, setPositionY] = React.useState(0);
  const [maxX, setMaxX] = React.useState(CARD_OUTER_WIDTH);
  const [maxY, setMaxY] = React.useState(CARD_HEIGHT);
  const [childTreeVersion, setChildTreeVersion] = React.useState(0);
  const [parentTreeVersion, setParentTreeVersion] = React.useState(0);
  const [root, dispatchRoot] = useReducer(rootReducer);
  const [childNodes, setChildNodes] = React.useState([]);
  const [childRels, setChildRels] = React.useState([]);
  const [childTree, setChildTree] = React.useState({});
  const [parentNodes, setParentNodes] = React.useState([]);
  const [parentRels, setParentRels] = React.useState([]);
  const [parentTree, setParentTree] = React.useState({});
  const [containerStyle, setContainerStyle] = React.useState({
    width: CARD_OUTER_WIDTH,
    height: CARD_HEIGHT,
  });

  //UPDATE CHILD TREE
  React.useEffect(() => {
    if (childTreeVersion > 0) {
      treeLayout(childTree);
      let nodes = childTree.descendants().slice(1);
      let rels = childTree.links();
      checkMax(nodes);
      setChildNodes(nodes);
      setChildRels(rels);
    }
  }, [childTreeVersion]);

  //UPDATE PARENT TREE
  React.useEffect(() => {
    if (parentTreeVersion > 0) {
      treeLayout(parentTree);
      let nodes = parentTree.descendants().slice(1);
      let rels = parentTree.links();
      checkMax(nodes);
      setParentNodes(nodes);
      setParentRels(rels);
    }
  }, [parentTreeVersion]);

  //CONTAINER BOUNDARIES
  const checkMax = (nodes) => {
    let _maxX = maxX;
    let _maxY = maxY;
    nodes.forEach((node) => {
      _maxX = Math.max(Math.abs(node.x), _maxX);
      _maxY = Math.max(Math.abs(node.y), _maxY);
    });
    setMaxX(_maxX);
    setMaxY(_maxY);
    setContainerStyle({
      width: 2 * _maxX,
      height: 2 * _maxY,
    });
  };

  //GET ROOT
  React.useEffect(() => {
    if (currentEntityId && currentPropId) {
      //reset graph
      dispatchRoot({ type: "set", root: null });
      setPositionY(0);
      setPositionX(0);
      setChildNodes([]);
      setParentNodes([]);
      setChildRels([]);
      setParentRels([]);
      getItem(currentEntityId, { withParents: true, propId: currentPropId })
        .then(async (entity) => {
          let root = hierarchy(entity);
          root.treeId = "root";
          root.extraSpouseIds = root.data.spouseIds; //because this is read straight away
          root.extraSiblingIds = root.data.siblingIds; //because this is read straight away
          root.x = 0;
          root.y = 0;
          dispatchRoot({ type: "set", root });

          //annoying but correct
          let childTree = hierarchy(entity);
          childTree.treeId = "root";
          setChildTree(childTree);

          let parentTree = hierarchy(entity);
          parentTree.treeId = "root";
          setParentTree(parentTree);

          setChildTreeVersion(childTreeVersion + 1);
          setParentTreeVersion(parentTreeVersion + 1);
        })
        .catch((e) => showError(e));
    }
  }, [currentEntityId, currentPropId]);

  const toggleChildren = (node) => {
    if (node._childrenExpanded) {
      return collapseChildren(node);
    }
    if (node._children) {
      return expandChildren(node);
    }

    getItems(node.data.childrenIds, { propId: currentPropId })
      .then((entities) => {
        entities.forEach((entity) => {
          const childNode = hierarchy(entity);
          childNode.depth = node.depth + 1;
          childNode.parent = node;
          childNode.treeId = childNode.data.id + "_child_" + childNode.depth;
          childNode.isChild = true;
          if (!node.children) {
            node.children = [];
          }
          node.children.push(childNode);
        });
        if (currentPropId === CHILD_ID) {
          //Remove spouses that are in the tree already
          node.children.forEach((childNode) => {
            childNode.extraSpouseIds = childNode.data.spouseIds.filter(
              (spouseId) => !node.children.find((c) => spouseId === c.data.id)
            );
            childNode.extraSiblingIds = childNode.data.siblingIds.filter(
              (siblingId) => !node.children.find((c) => siblingId === c.data.id) //optimise with a map?
            );
          });
        }
        expandChildren(node);
      })
      .catch((e) => showError(e));
  };

  const collapseChildren = (node) => {
    if (!node.children) return;
    node._childrenExpanded = false;
    node._children = node.children;
    node._children.forEach(collapseChildren);
    node.children = null;
    setChildTreeVersion(childTreeVersion + 1);
  };

  const expandChildren = (node) => {
    node._childrenExpanded = true;
    //was expanded previously
    if (!node.children && node._children) {
      node.children = node._children;
      node._children = null;
    }
    setChildTreeVersion(childTreeVersion + 1);
    setPositionX(-node.x);
    setPositionY(-node.y);
  };

  const toggleParents = (node) => {
    if (node._parentsExpanded) {
      return collapseParents(node);
    }
    if (node._parents) {
      return expandParents(node);
    }

    getItems(node.data.parentIds, {
      withChildren: false,
      withParents: true,
      propId: currentPropId,
    })
      .then((entities) => {
        entities.forEach((entity, index) => {
          const parentNode = hierarchy(entity);
          parentNode.isParent = true;
          parentNode.depth = node.depth - 1;
          parentNode.treeId =
            parentNode.data.id + "_parent_" + parentNode.depth;
          parentNode.parent = node;
          if (!node.children) {
            node.children = [];
          }
          node.children.push(parentNode);
        });
        if (currentPropId === CHILD_ID) {
          //Remove spouses and siblings that are in the tree already
          node.children.forEach((parentNode) => {
            parentNode.extraSpouseIds = parentNode.data.spouseIds.filter(
              (spouseId) => !node.children.find((p) => spouseId === p.data.id) //optimise with a map?
            );
            parentNode.extraSiblingIds = parentNode.data.siblingIds.filter(
              (siblingId) => !node.children.find((p) => siblingId === p.data.id) //optimise with a map?
            );
          });
        }
        expandParents(node);
      })
      .catch((e) => showError(e));
  };

  const collapseParents = (node) => {
    if (!node.children) return;
    node._parentsExpanded = false;
    node._parents = node.children;
    node._parents.forEach(collapseParents);
    node.children = null;
    setParentTreeVersion(parentTreeVersion + 1);
  };

  const expandParents = (node) => {
    node._parentsExpanded = true;
    //was expanded previously
    if (!node.children && node._parents) {
      node.children = node._parents;
      node._parents = null;
    }
    setParentTreeVersion(parentTreeVersion + 1);
    setPositionX(-node.x);
    setPositionY(-node.y);
  };

  const toggleSpouses = (node) => {
    if (node._spousesExpanded) {
      return collapseSpouses(node);
    }
    if (node._spouses) {
      return expandSpouses(node);
    }

    getItems(node.extraSpouseIds)
      .then((entities) => {
        entities.forEach((entity) => {
          const childNode = hierarchy(entity);
          childNode.depth = node.depth;
          childNode.isSpouse = true;
          childNode.treeId = childNode.data.id + "_spouse_" + childNode.depth;
          childNode.virtualParent = node;
          childNode.parent = node.parent;
          const childIndex = node.parent.children.indexOf(node) + 1;
          node.parent.children.splice(childIndex, 0, childNode);
        });
        expandSpouses(node);
      })
      .catch((e) => showError(e));
  };

  const expandSpouses = (node) => {
    node._spousesExpanded = true;
    if (node.isChild) setChildTreeVersion(childTreeVersion + 1);
    if (node.isParent) setParentTreeVersion(parentTreeVersion + 1);
  };

  const collapseSpouses = (node) => {
    node._spousesExpanded = false;
    node.parent.children = node.parent.children.filter(
      (child) =>
        !(child.isSpouse && child.virtualParent.data.id === node.data.id)
    );
    if (node.isChild) setChildTreeVersion(childTreeVersion + 1);
    if (node.isParent) setParentTreeVersion(parentTreeVersion + 1);
  };

  const toggleSiblings = (node) => {
    if (node._siblingsExpanded) {
      return collapseSiblings(node);
    }
    if (node._siblings) {
      return expandSiblings(node);
    }

    getItems(node.extraSiblingIds)
      .then((entities) => {
        entities.forEach((entity) => {
          const childNode = hierarchy(entity);
          childNode.depth = node.depth;
          childNode.isSibling = true;
          childNode.treeId = childNode.data.id + "_sibling_" + childNode.depth;
          childNode.virtualParent = node;

          childNode.parent = node.parent;
          const childIndex = node.parent.children.indexOf(node);
          node.parent.children.splice(childIndex, 0, childNode);
        });
        expandSiblings(node);
      })
      .catch((e) => showError(e));
  };

  const expandSiblings = (node) => {
    node._siblingsExpanded = true;
    if (node.isChild) setChildTreeVersion(childTreeVersion + 1);
    if (node.isParent) setParentTreeVersion(parentTreeVersion + 1);
  };

  const collapseSiblings = (node) => {
    node._siblingsExpanded = false;
    node.parent.children = node.parent.children.filter(
      (child) =>
        !(child.isSibling && child.virtualParent.data.id === node.data.id)
    );
    if (node.isChild) setChildTreeVersion(childTreeVersion + 1);
    if (node.isParent) setParentTreeVersion(parentTreeVersion + 1);
  };

  const toggleRootSpouses = () => {
    if (root._spousesExpanded) {
      return dispatchRoot({ type: "collapseRootSpouses", root });
    }
    if (root._spouses) {
      return dispatchRoot({ type: "expandRootSpouses", root });
    }

    getItems(root.extraSpouseIds)
      .then((entities) => {
        entities.forEach((entity, index) => {
          const spouseNode = hierarchy(entity);
          spouseNode.isSpouse = true;
          spouseNode.x =
            CARD_WIDTH * SAME_GROUP_SEPARATION +
            CARD_OUTER_WIDTH * SIBLING_SPOUSE_SEPARATION * index;
          spouseNode.y = 0;
          spouseNode.treeId = spouseNode.data.id + "_spouse_root";
          if (!root.spouses) root.spouses = [];
          root.spouses.push(spouseNode);
        });
        dispatchRoot({ type: "expandRootSpouses", root });
      })
      .catch((e) => showError(e));
  };

  const toggleRootSiblings = () => {
    if (root._siblingsExpanded) {
      return dispatchRoot({ type: "collapseRootSiblings", root });
    }
    if (root._spouses) {
      return dispatchRoot({ type: "expandRootSiblings", root });
    }

    getItems(root.data.siblingIds)
      .then((entities) => {
        entities.forEach((entity, index, { length }) => {
          const siblingNode = hierarchy(entity);
          siblingNode.isSibling = true;
          siblingNode.x =
            -SAME_GROUP_SEPARATION -
            CARD_OUTER_WIDTH * SIBLING_SPOUSE_SEPARATION * (length - index);
          siblingNode.y = 0;
          siblingNode.treeId = siblingNode.data.id + "_sibling_root";
          if (!root.siblings) root.siblings = [];
          root.siblings.push(siblingNode);
        });
        dispatchRoot({ type: "expandRootSiblings", root });
      })
      .catch((e) => showError(e));
  };

  return (
    <div className="Graph">
      <TransformWrapper
        zoomIn={{ step: 100 }}
        zoomOut={{ step: 100 }}
        options={{ limitToBounds: false, minScale: 0.2, maxScale: 2 }}
        scalePadding={{ disabled: true, size: 1 }}
        // positionX={positionX}
        // positionY={positionY}
        // onPanning={({ positionX, positionY }) => {
        //   setPositionX(positionX);
        //   setPositionY(positionY);
        // }}
      >
        <TransformComponent>
          <div className="center">
            <svg style={containerStyle}>
              <g
                transform={`translate(${containerStyle.width / 2} ${
                  containerStyle.height / 2
                })`}
              >
                <g className="rels">
                  {childRels.map((rel) => (
                    <Rel
                      key={rel.source.treeId + rel.target.treeId}
                      rel={rel}
                      isChild
                    />
                  ))}
                  {parentRels.map((rel) => (
                    <Rel
                      key={rel.source.treeId + rel.target.treeId}
                      rel={rel}
                      isParent
                    />
                  ))}
                </g>
              </g>
            </svg>
            <div style={containerStyle}>
              <div
                style={{
                  position: "absolute",
                  left: containerStyle.width / 2,
                  top: containerStyle.height / 2,
                }}
              >
                <div className="nodes">
                  {root &&
                    root.siblings &&
                    root.siblings.map((node) => (
                      <Node key={node.treeId} node={node} />
                    ))}
                  {root && (
                    <Node
                      toggleChildren={() => toggleChildren(childTree)}
                      toggleParents={() => toggleParents(parentTree)}
                      toggleSpouses={toggleRootSpouses}
                      toggleSiblings={toggleRootSiblings}
                      node={root}
                    />
                  )}
                  {root &&
                    root.spouses &&
                    root.spouses.map((node) => (
                      <Node key={node.treeId} node={node} />
                    ))}
                  {childNodes.map((node) => (
                    <Node
                      key={node.treeId}
                      toggleChildren={toggleChildren}
                      toggleSpouses={toggleSpouses}
                      toggleSiblings={toggleSiblings}
                      node={node}
                    />
                  ))}
                  {parentNodes.map((node) => (
                    <Node
                      key={node.treeId}
                      toggleSpouses={toggleSpouses}
                      toggleSiblings={toggleSiblings}
                      toggleParents={toggleParents}
                      node={node}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
