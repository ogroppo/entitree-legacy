import React, {
  useReducer,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { getItem, getItems } from "../../lib/api";
import "./Graph.scss";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { hierarchy } from "d3-hierarchy";
import { CARD_WIDTH, SIBLING_SPOUSE_SEPARATION } from "../../constants/tree";
import Node from "../Node/Node";
import Rel from "../Rel/Rel";
import { CHILD_ID } from "../../constants/properties";
import graphReducer, { initialState } from "./graphReducer";
import { AppContext } from "../../App";
import getActualSiblingsOrSpuses from "../../lib/getActualSiblings";
import { Button } from "react-bootstrap";
import { FiMinus, FiPlus, FiPrinter } from "react-icons/fi";
import { IoMdExpand } from "react-icons/io";
import { RiFocus3Line } from "react-icons/ri";
import domtoimage from "dom-to-image";

export default function Graph({ currentEntityId, currentPropId }) {
  const { showInfo, currentLang, showError } = useContext(AppContext);
  const [graph, dispatchGraph] = useReducer(graphReducer, initialState);
  const graphRef = useRef();
  const scaleRef = useRef(1);
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
          let root = hierarchy(entity);
          root.treeId = "root";
          root.actualSpouseIds = root.data.spouseIds; //because this is read straight away
          root.actualSiblingIds = root.data.siblingIds; //because this is read straight away
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

  const fitTree = (setTransform) => {
    const leftEdge = graph.maxLeft - CARD_WIDTH / 2;
    const topEdge = graph.maxTop - CARD_WIDTH / 2;
    const rightEdge = graph.maxRight + CARD_WIDTH / 2;
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

    centerPoint(setTransform, centerX, centerY, nextScale);
  };

  const centerPoint = (setTransform, x, y, scale = scaleRef.current) => {
    const halfWidth = graphWidth / 2;
    var calculatedPositionX = halfWidth - (halfWidth + x) * scale;
    const halfHeight = graphHeight / 2;
    var calculatedPositionY = halfHeight - (halfHeight + y) * scale;
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
      <TransformWrapper
        zoomIn={{ step: 20 }}
        zoomOut={{ step: 20 }}
        wheel={{ step: 25 }}
        options={{
          limitToBounds: false,
          minScale: 0.2,
          maxScale: 2,
        }}
        onZoomChange={(e) => {
          scaleRef.current = e.scale;
        }}
        //scale={scale}
        // onWheel={({ positionX, positionY, scale, ...rest }) => {
        //   if (scale >= 0.2 && scale <= 2)
        //     dispatchGraph({ type: "set", scale, positionX, positionY });
        // }}
        // positionX={positionX}
        // positionY={positionY}
        // onPanning={({ positionX, positionY }) => {
        //   dispatchGraph({ type: "set", positionX });
        //   dispatchGraph({ type: "set", positionY });
        // }}
      >
        {({
          zoomIn,
          zoomOut,
          resetTransform,
          setTransform,
          setPositionX,
          setScale,
        }) => (
          <>
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
                          toggleChildren={() => {
                            centerPoint(setTransform, 0, 0);
                            toggleChildren(childTree);
                          }}
                          toggleParents={() => {
                            centerPoint(setTransform, 0, 0);
                            toggleParents(parentTree);
                          }}
                          toggleSpouses={() => {
                            centerPoint(setTransform, 0, 0);
                            toggleRootSpouses();
                          }}
                          toggleSiblings={() => {
                            centerPoint(setTransform, 0, 0);
                            toggleRootSiblings();
                          }}
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
                          toggleChildren={(node) => {
                            centerPoint(setTransform, node.x, node.y);
                            toggleChildren(node);
                          }}
                          toggleSpouses={(node) => {
                            centerPoint(setTransform, node.x, node.y);
                            toggleSpouses(node);
                          }}
                          toggleSiblings={(node) => {
                            centerPoint(setTransform, node.x, node.y);
                            toggleSiblings(node);
                          }}
                          node={node}
                        />
                      ))}
                      {parentNodes.map((node) => (
                        <Node
                          key={node.treeId}
                          toggleSpouses={(node) => {
                            centerPoint(setTransform, node.x, node.y);
                            toggleSpouses(node);
                          }}
                          toggleSiblings={(node) => {
                            centerPoint(setTransform, node.x, node.y);
                            toggleSiblings(node);
                          }}
                          toggleParents={(node) => {
                            centerPoint(setTransform, node.x, node.y);
                            toggleParents(node);
                          }}
                          node={node}
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
              <Button variant="light" onClick={resetTransform}>
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
              <Button
                variant="light"
                onClick={() => {
                  domtoimage
                    .toPng(graphRef.current)
                    .then(function (dataUrl) {
                      var img = new Image();
                      img.src = dataUrl;
                      document.body.appendChild(img);
                    })
                    .catch(function (error) {
                      console.error("oops, something went wrong!", error);
                    });
                }}
              >
                <FiPrinter />
              </Button>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
