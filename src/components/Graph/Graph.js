import "./Graph.scss";
import { TransformWrapper } from "react-zoom-pan-pinch";
import { AppContext } from "../../App";
import React, {
  useReducer,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { TransformComponent } from "react-zoom-pan-pinch";
import { getItem, getItems } from "../../lib/api";
import { hierarchy } from "d3-hierarchy";
import { CARD_WIDTH, SIBLING_SPOUSE_SEPARATION } from "../../constants/tree";
import Node from "../Node/Node";
import Rel from "../Rel/Rel";
import { CHILD_ID } from "../../constants/properties";
import graphReducer, { initialState } from "./graphReducer";
import getActualSiblingsOrSpuses from "../../lib/getActualSiblings";
import { Button } from "react-bootstrap";
import { FiMinus, FiPlus, FiPrinter } from "react-icons/fi";
import { IoMdExpand } from "react-icons/io";
import { RiFocus3Line } from "react-icons/ri";
import domtoimage from "dom-to-image";

function Graph({
  currentEntityId,
  currentPropId,
  setTransform,
  zoomIn,
  zoomOut,
  scale: currentScale,
  ...props
}) {
  const { showError } = useContext(AppContext);

  const [graph, dispatchGraph] = useReducer(graphReducer, initialState);
  const [focusedNode, setFocusedNode] = useState();

  const graphRef = useRef();
  const [graphWidth, setGraphWidth] = useState(0);
  const [graphHeight, setGraphHeight] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setGraphWidth(graphRef.current.offsetWidth);
      setGraphHeight(graphRef.current.offsetHeight);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [graphRef]);

  //GET ROOT
  useEffect(() => {
    if (currentEntityId && currentPropId) {
      //reset graph
      dispatchGraph({ type: "reset" });
      getItem(currentEntityId, {
        withParents: true,
        propId: currentPropId,
      })
        .then(async (entity) => {
          setTransform(0, 0, 1, 0);
          let root = hierarchy(entity);
          root.treeId = "root";
          root.actualSpouseIds = root.data.spouseIds; //because this is read straight away
          root.actualSiblingIds = root.data.siblingIds; //because this is read straight away
          root.x = 0;
          root.y = 0;
          setFocusedNode(root);

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
        getActualSiblingsOrSpuses(node);
      }

      dispatchGraph({ type: "expandChildren", node });
    } catch (error) {
      showError(error);
    }
  };

  const toggleParents = async (node) => {
    if (node._parentsExpanded) {
      return dispatchGraph({ type: "collapseParents", node });
    }
    //has cached parents
    if (node._parents) {
      return dispatchGraph({ type: "expandParents", node });
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
        getActualSiblingsOrSpuses(node);
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
      const entities = await getItems(node.actualSpouseIds);
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
      const entities = await getItems(node.actualSiblingIds);
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
      const entities = await getItems(root.actualSpouseIds);
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

  const fitTree = () => {
    const leftEdge = graph.maxLeft - CARD_WIDTH; //should be CARD_WIDTH / 2 but give some padding
    const topEdge = graph.maxTop - CARD_WIDTH / 2;
    const rightEdge = graph.maxRight + CARD_WIDTH;
    const bottomEdge = graph.maxBottom + CARD_WIDTH / 2;
    const treeWidth = rightEdge - leftEdge;
    const treeHeight = bottomEdge - topEdge;

    let nextScale;
    if (graphWidth - treeWidth < graphHeight - treeHeight) {
      nextScale = graphWidth / treeWidth;
    } else {
      nextScale = graphHeight / treeHeight;
    }
    if (nextScale > 2) nextScale = 2;

    const centerX = leftEdge + treeWidth / 2;
    const centerY = topEdge + treeHeight / 2;

    centerPoint(centerX, centerY, nextScale);
  };

  const centerPoint = (x, y, scale = currentScale) => {
    const halfWidth = graphWidth / 2;
    const calculatedPositionX = halfWidth - (halfWidth + x) * scale;
    let calculatedPositionY = y;
    if (!isNaN(y)) {
      const halfHeight = graphHeight / 2;
      calculatedPositionY = halfHeight - (halfHeight + y) * scale;
    }
    setTransform(calculatedPositionX, calculatedPositionY, scale);
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
  } = graph;

  return (
    <div className="Graph" ref={graphRef}>
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
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
                ))}
                {parentRels.map((rel) => (
                  <Rel key={rel.source.treeId + rel.target.treeId} rel={rel} />
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
                    <Node
                      key={node.treeId}
                      node={node}
                      setFocusedNode={setFocusedNode}
                      focusedNode={focusedNode}
                    />
                  ))}
                {root && (
                  <Node
                    toggleChildren={() => {
                      centerPoint(0, 0);
                      toggleChildren(childTree);
                    }}
                    toggleParents={() => {
                      centerPoint(0, 0);
                      toggleParents(parentTree);
                    }}
                    toggleSpouses={() => {
                      centerPoint(0);
                      toggleRootSpouses();
                    }}
                    toggleSiblings={() => {
                      centerPoint(0);
                      toggleRootSiblings();
                    }}
                    node={root}
                    setFocusedNode={setFocusedNode}
                    focusedNode={focusedNode}
                  />
                )}
                {root &&
                  root.spouses &&
                  root.spouses.map((node) => (
                    <Node
                      key={node.treeId}
                      node={node}
                      setFocusedNode={setFocusedNode}
                      focusedNode={focusedNode}
                    />
                  ))}
                {childNodes.map((node) => (
                  <Node
                    key={node.treeId}
                    toggleChildren={(node) => {
                      centerPoint(node.x, node.y);
                      toggleChildren(node);
                    }}
                    toggleSpouses={(node) => {
                      centerPoint(node.x);
                      toggleSpouses(node);
                    }}
                    toggleSiblings={(node) => {
                      centerPoint(node.x);
                      toggleSiblings(node);
                    }}
                    node={node}
                    setFocusedNode={setFocusedNode}
                    focusedNode={focusedNode}
                  />
                ))}
                {parentNodes.map((node) => (
                  <Node
                    key={node.treeId}
                    toggleSpouses={(node) => {
                      centerPoint(node.x);
                      toggleSpouses(node);
                    }}
                    toggleSiblings={(node) => {
                      centerPoint(node.x);
                      toggleSiblings(node);
                    }}
                    toggleParents={(node) => {
                      toggleParents(node);
                      centerPoint(node.x, node.y);
                    }}
                    node={node}
                    setFocusedNode={setFocusedNode}
                    focusedNode={focusedNode}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </TransformComponent>
      <div className="navigation">
        <Button variant="light" onClick={zoomIn}>
          <FiPlus />
        </Button>
        <Button variant="light" onClick={zoomOut}>
          <FiMinus />
        </Button>
        <Button
          variant="light"
          onClick={() => {
            centerPoint(focusedNode.x, focusedNode.y);
          }}
        >
          <RiFocus3Line />
        </Button>
        <Button
          variant="light"
          onClick={() => {
            fitTree(setTransform);
          }}
        >
          <IoMdExpand />
        </Button>
        <Button variant="light" onClick={window.print}>
          <FiPrinter />
        </Button>
      </div>
    </div>
  );
}

export default function GraphWrapper({ currentEntityId, currentPropId }) {
  return (
    <div className="GraphWrapper">
      <TransformWrapper
        zoomIn={{ step: 20 }}
        zoomOut={{ step: 20 }}
        wheel={{ step: 25 }}
        options={{
          limitToBounds: false,
          minScale: 0,
          maxScale: 2,
        }}
      >
        {(props) => (
          <Graph
            {...props}
            currentEntityId={currentEntityId}
            currentPropId={currentPropId}
          />
        )}
      </TransformWrapper>
    </div>
  );
}
