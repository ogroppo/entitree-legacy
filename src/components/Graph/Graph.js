import React from "react";
import { getItem, getItems } from "../../lib/api";
import { Badge, Button } from "react-bootstrap";
import "./Graph.scss";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import getPathD from "../../lib/getPathD";
import { tree as d3Tree, hierarchy } from "d3-hierarchy";
const CARD_WIDTH = 220;
const CARD_GAP = 10;
const CARD_PADDING = 5;
const CARD_INNER_WIDTH = CARD_WIDTH - 2 * CARD_PADDING - 2; //borderrrr
const IMAGE_HEIGHT = 80;
const CARD_HEIGHT = IMAGE_HEIGHT + 2 * CARD_PADDING;
const CARD_VERTICAL_SPACING = CARD_HEIGHT + 100;
const CARD_OUTER_WIDTH = CARD_WIDTH + CARD_GAP;
const treeLayout = d3Tree();
treeLayout.nodeSize([CARD_OUTER_WIDTH, CARD_VERTICAL_SPACING]);
treeLayout.separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

export default function Graph({ showError, currentEntityId, currentPropId }) {
  const [positionX, setPositionX] = React.useState(0);
  const [positionY, setPositionY] = React.useState(0);
  const [maxX, setMaxX] = React.useState(CARD_OUTER_WIDTH);
  const [maxY, setMaxY] = React.useState(CARD_HEIGHT);
  const [childTreeVersion, setChildTreeVersion] = React.useState(0);
  const [parentTreeVersion, setParentTreeVersion] = React.useState(0);
  const [root, setRoot] = React.useState();
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

  React.useEffect(() => {
    if (currentEntityId && currentPropId) {
      setRoot(null);
      setPositionY(0);
      setPositionX(0);
      setChildNodes([]);
      setParentNodes([]);
      setChildRels([]);
      setParentRels([]);
      getItem(currentEntityId, { withParents: true, propId: currentPropId })
        .then(async (entity) => {
          let root = hierarchy(entity);
          setRoot(root);

          let childTree = hierarchy(entity);
          setChildTree(childTree);

          let parentTree = hierarchy(entity);
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
        entities.forEach((entity, index) => {
          const childNode = hierarchy(entity);
          childNode.depth = node.depth + 1;
          childNode.height = node.height - 1;
          childNode.parent = node;
          if (!node.children) {
            node.children = [];
            node.data.children = [];
          }
          node.children.push(childNode);
          node.data.children.push(childNode.data);
        });
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
          parentNode.height = node.height + 1;
          parentNode.parent = node;
          if (!node.children) {
            node.children = [];
            node.data.children = [];
          }
          node.children.push(parentNode);
          node.data.children.push(parentNode.data);
        });
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
                      key={rel.source.data.id + rel.target.data.id}
                      rel={rel}
                    />
                  ))}
                  {parentRels.map((rel) => (
                    <Rel
                      key={rel.source.data.id + rel.target.data.id}
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
                  {root && (
                    <Node
                      key={root.data.id}
                      toggleChildren={() => toggleChildren(childTree)}
                      toggleParents={() => toggleParents(parentTree)}
                      node={root}
                    />
                  )}
                  {childNodes.map((node) => (
                    <Node
                      key={node.data.id}
                      toggleChildren={toggleChildren}
                      toggleParents={() => {}}
                      node={node}
                    />
                  ))}
                  {parentNodes.map((node) => (
                    <Node
                      key={node.data.id}
                      toggleChildren={() => {}}
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

function Rel({ rel, isParent }) {
  return (
    <path
      className="relPath"
      d={getPathD(rel.source, rel.target, {
        offsetStartY: isParent ? -40 : 40,
      })}
    />
  );
}

function Node({ node, toggleParents, toggleChildren }) {
  return (
    <div
      style={{ left: node.x, top: node.y, width: CARD_WIDTH }}
      className="node"
    >
      <div
        className="img"
        style={{ height: IMAGE_HEIGHT, width: IMAGE_HEIGHT }}
      >
        {node.data.images[0] && (
          <img alt={node.data.images[0].alt} src={node.data.images[0].url} />
        )}
        {!node.data.images[0] && (
          <img src={`https://via.placeholder.com/${IMAGE_HEIGHT}`} />
        )}
      </div>
      <div
        className="content"
        style={{ width: CARD_INNER_WIDTH - IMAGE_HEIGHT }}
      >
        <div className="label">
          <a
            target="_blank"
            href={`https://www.wikidata.org/wiki/${node.data.id}`}
          >
            {node.data.label}
          </a>
        </div>
        <div className="description">{node.data.description}</div>
      </div>
      {node.data.parentIds && !!node.data.parentIds.length && (
        <Button
          className="parentCount"
          variant={"info"}
          onClick={() => toggleParents(node)}
        >
          {node.data.parentIds.length}
        </Button>
      )}
      {node.data.childrenIds && !!node.data.childrenIds.length && (
        <Button
          className="childrenCount"
          variant={"info"}
          onClick={() => toggleChildren(node)}
        >
          {node.data.childrenIds.length}
        </Button>
      )}
    </div>
  );
}
