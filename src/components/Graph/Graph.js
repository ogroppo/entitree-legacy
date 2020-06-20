import React, { useReducer, useContext } from "react";
import { getItem, getItems } from "../../lib/api";
import "./Graph.scss";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { hierarchy } from "d3-hierarchy";
import {
  CARD_WIDTH,
  SIBLING_SPOUSE_SEPARATION,
  SAME_GROUP_SEPARATION,
} from "../../constants/tree";
import Node from "../Node/Node";
import Rel from "../Rel/Rel";
import { CHILD_ID } from "../../constants/properties";
import graphReducer, { initialState } from "./graphReducer";
import { AppContext } from "../../App";

export default function Graph({ currentEntityId, currentPropId }) {
  const { showInfo, currentLang, showError } = useContext(AppContext);
  const [graph, dispatchGraph] = useReducer(graphReducer, initialState);

  //GET ROOT
  React.useEffect(() => {
    if (currentEntityId && currentPropId) {
      //reset graph
      dispatchGraph({ type: "reset" });
      getItem(currentEntityId, {
        withParents: true,
        propId: currentPropId,
      })
        .then(async (entity) => {
          let root = hierarchy(entity);
          root.treeId = "root";
          root.extraSpouseIds = root.data.spouseIds; //because this is read straight away
          root.extraSiblingIds = root.data.siblingIds; //because this is read straight away
          root.x = 0;
          root.y = 0;

          //annoyingly a repetition but correct
          let childTree = hierarchy(entity);
          childTree.treeId = "root";

          let parentTree = hierarchy(entity);
          parentTree.treeId = "root";

          dispatchGraph({ type: "set", root, childTree, parentTree });
        })
        .catch((e) => showError(e));
    }
  }, [currentEntityId, currentPropId]);

  const toggleChildren = async (node) => {
    if (node._childrenExpanded) {
      return dispatchGraph({ type: "collapseChildren", node });
    }
    //has cached children
    if (node._children) {
      return dispatchGraph({ type: "expandChildren", node });
    }
    try {
      if (!node.data.childrenIds || !node.data.childrenIds.length) return;

      const entities = await getItems(node.data.childrenIds, {
        propId: currentPropId,
      });
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
        //Remove spouses and siblings that are in the tree already
        node.children.forEach((childNode) => {
          childNode.extraSpouseIds = childNode.data.spouseIds.filter(
            (spouseId) => !node.children.find((c) => spouseId === c.data.id)
          );
          childNode.extraSiblingIds = childNode.data.siblingIds.filter(
            (siblingId) => !node.children.find((c) => siblingId === c.data.id) //optimise with a map?
          );
        });
      }

      dispatchGraph({ type: "expandChildren", node });
    } catch (error) {
      showError(error);
    }
  };

  const toggleParents = async (node) => {
    if (node._parentsExpanded) {
      dispatchGraph({ type: "collapseParents", node });
    }
    //has cached parents
    if (node._parents) {
      dispatchGraph({ type: "expandParents", node });
      return;
    }

    try {
      if (!node.data.parentIds || !node.data.parentIds.length) return;
      const entities = await getItems(node.data.parentIds, {
        withChildren: false,
        withParents: true,
        propId: currentPropId,
      });
      entities.forEach((entity) => {
        const parentNode = hierarchy(entity);
        parentNode.isParent = true;
        parentNode.depth = node.depth - 1;
        parentNode.treeId = parentNode.data.id + "_parent_" + parentNode.depth;
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
      dispatchGraph({ type: "expandParents", node });
    } catch (error) {
      showError(error);
    }
  };

  const toggleSpouses = async (node) => {
    if (node._spousesExpanded) {
      return dispatchGraph({ type: "collapseSpouses", node });
    }
    if (node._spouses) {
      return dispatchGraph({ type: "expandSpouses", node });
    }
    try {
      const entities = await getItems(node.extraSpouseIds);
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
      dispatchGraph({ type: "expandSpouses", node });
    } catch (error) {
      showError(error);
    }
  };

  const toggleSiblings = async (node) => {
    if (node._siblingsExpanded) {
      return dispatchGraph({ type: "collapseSiblings", node });
    }

    if (node._siblings) {
      return dispatchGraph({ type: "expandSiblings", node });
    }

    try {
      const entities = await getItems(node.extraSiblingIds);
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
      dispatchGraph({ type: "expandSiblings", node });
    } catch (error) {
      showError(error);
    }
  };

  const toggleRootSpouses = async () => {
    const { root } = graph;
    if (root._spousesExpanded) {
      return dispatchGraph({ type: "collapseRootSpouses", root });
    }
    if (root._spouses) {
      return dispatchGraph({ type: "expandRootSpouses", root });
    }

    try {
      const entities = await getItems(root.extraSpouseIds);
      const baseX = CARD_WIDTH * SIBLING_SPOUSE_SEPARATION;
      entities.forEach((entity, index) => {
        const spouseNode = hierarchy(entity);
        spouseNode.isSpouse = true;
        spouseNode.x = baseX + baseX * index;
        spouseNode.y = 0;
        spouseNode.treeId = spouseNode.data.id + "_spouse_root";
        if (!root.spouses) root.spouses = [];
        root.spouses.push(spouseNode);
      });
      dispatchGraph({ type: "expandRootSpouses", root });
    } catch (error) {
      showError(error);
    }
  };

  const toggleRootSiblings = async () => {
    const { root } = graph;
    if (root._siblingsExpanded) {
      return dispatchGraph({ type: "collapseRootSiblings", root });
    }
    if (root._siblings) {
      return dispatchGraph({ type: "expandRootSiblings", root });
    }

    try {
      const entities = await getItems(root.data.siblingIds);
      const baseX = -(CARD_WIDTH * SIBLING_SPOUSE_SEPARATION);
      entities.forEach((entity, index, { length }) => {
        const siblingNode = hierarchy(entity);
        siblingNode.isSibling = true;
        siblingNode.x = baseX * (length - index);
        siblingNode.y = 0;
        siblingNode.treeId = siblingNode.data.id + "_sibling_root";
        if (!root.siblings) root.siblings = [];
        root.siblings.push(siblingNode);
      });
      dispatchGraph({ type: "expandRootSiblings", root });
    } catch (error) {
      showError(error);
    }
  };

  const {
    root,
    childTree,
    parentTree,
    containerStyle,
    parentNodes,
    childNodes,
    parentRels,
    childRels,
    positionX,
    positionY,
    scale,
  } = graph;

  return (
    <div className="Graph">
      <TransformWrapper
        zoomIn={{ step: 100 }}
        zoomOut={{ step: 100 }}
        wheel={{ step: 25 }}
        options={{ limitToBounds: false, minScale: 0.2, maxScale: 2 }}
        scalePadding={{ disabled: true, size: 1 }}
        positionX={positionX}
        positionY={positionY}
        scale={scale}
        onWheel={({ positionX, positionY, scale, ...rest }) => {
          if (scale >= 0.2 && scale <= 2)
            dispatchGraph({ type: "set", scale, positionX, positionY });
        }}
        onPanning={({ positionX, positionY }) => {
          dispatchGraph({ type: "set", positionX });
          dispatchGraph({ type: "set", positionY });
        }}
      >
        <TransformComponent>
          <div className="center">
            <svg className="svgContainer" style={containerStyle}>
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
                    />
                  ))}
                  {parentRels.map((rel) => (
                    <Rel
                      key={rel.source.treeId + rel.target.treeId}
                      rel={rel}
                    />
                  ))}
                  {root &&
                    root.spouses &&
                    root.spouses.map((target) => {
                      return (
                        <Rel
                          key={"root" + target.treeId}
                          rel={{ source: root, target }}
                        />
                      );
                    })}
                  {root &&
                    root.siblings &&
                    root.siblings.map((target) => (
                      <Rel
                        key={"root" + target.treeId}
                        rel={{ source: root, target }}
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
