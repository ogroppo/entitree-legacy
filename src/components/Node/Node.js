import React, { useState } from "react";
import {
  IMAGE_SIZE,
  CARD_WIDTH,
  CARD_PADDING,
  CARD_CONTENT_WIDTH,
} from "../../constants/tree";
import { Button } from "react-bootstrap";
import "./Node.scss";

export default function Node({
  node,
  toggleParents,
  toggleChildren,
  toggleSiblings,
  toggleSpouses,
  setFocusedNode,
  focusedNode,
  debug,
}) {
  if (debug) console.log(node);

  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => {
    if (!node.data.images || !node.data.images.length) return;
    let nextIndex = imageIndex + 1;
    if (nextIndex === node.data.images.length) nextIndex = 0;
    setImageIndex(nextIndex);
  };

  const {
    data: { images },
  } = node;

  return (
    <div
      style={{
        left: node.x,
        top: node.y,
        width: CARD_WIDTH,
        padding: CARD_PADDING,
      }}
      className={`Node ${focusedNode.treeId === node.treeId ? "focused" : ""}`}
      onClick={() => setFocusedNode(node)}
    >
      <div
        className="imgWrapper"
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        onClick={nextImage}
      >
        {images[imageIndex] && (
          <img
            alt={images[imageIndex].alt}
            src={images[imageIndex].url}
            title={images[imageIndex].source}
          />
        )}
        {(!images || !images.length) && (
          <img src={`https://via.placeholder.com/${IMAGE_SIZE}`} />
        )}
        {images && images.length > 1 && (
          <span className="imgMore">+{images.length - 1}</span>
        )}
      </div>
      <div
        className="content"
        style={{ height: IMAGE_SIZE, width: CARD_CONTENT_WIDTH }}
      >
        <div className="label">
          {node.data.label ? (
            <a
              target="_blank"
              title={node.data.label}
              href={`https://www.wikidata.org/wiki/${node.data.id}`}
            >
              {node.data.label}
            </a>
          ) : (
            <a
              target="_blank"
              title={"Unlabelled item"}
              href={`https://www.wikidata.org/wiki/${node.data.id}`}
            >
              <i>Unlabelled</i>
            </a>
          )}
        </div>
        <div className="description" title={node.data.description}>
          {node.data.description}
        </div>
        <div className="dates">
          {node.data.birthDate}
          {node.data.birthDate && node.data.deathDate && " - "}
          {node.data.deathDate && node.data.deathDate}
        </div>
        {node.data.externalLinks && !!node.data.externalLinks.length && (
          <div className="externalLinks">
            {node.data.externalLinks.map((link) => (
              <a
                key={link.title}
                target="_blank"
                title={link.title}
                href={link.url}
              >
                <img src={link.iconSrc} alt={link.alt} />
              </a>
            ))}
          </div>
        )}
      </div>
      <Counter
        ids={node.actualSiblingIds}
        node={node}
        toggleFn={toggleSiblings}
        className="siblingCount"
      />
      <Counter
        ids={node.actualSpouseIds}
        node={node}
        toggleFn={toggleSpouses}
        className="spouseCount"
      />
      <Counter
        ids={node.data.parentIds}
        node={node}
        toggleFn={toggleParents}
        className="parentCount"
      />
      <Counter
        ids={node.data.childrenIds}
        node={node}
        toggleFn={toggleChildren}
        className="childrenCount"
      />
    </div>
  );
}

function Counter({ ids, node, toggleFn, className, Icon }) {
  const [disabled, setDisabled] = React.useState(false);
  if (!ids || !ids.length) return null;
  return (
    <Button
      className={`${className} counter`}
      variant={"info"}
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        await toggleFn(node);
        setDisabled(false);
      }}
    >
      {ids.length}
    </Button>
  );
}
