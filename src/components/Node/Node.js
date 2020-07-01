import React, { useState, useEffect, useRef } from "react";
import {
  IMAGE_SIZE,
  CARD_WIDTH,
  CARD_PADDING,
  CARD_CONTENT_WIDTH,
  CARD_HEIGHT,
  CARD_VERTICAL_GAP,
} from "../../constants/tree";
import { Button } from "react-bootstrap";
import {
  FiChevronLeft,
  FiChevronUp,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { BsPlusCircle } from "react-icons/bs";
import "./Node.scss";

export default function Node({
  node,
  index,
  currentProp,
  toggleParents,
  toggleChildren,
  toggleSiblings,
  toggleSpouses,
  setFocusedNode,
  focusedNode,
  showMoreLeftParents,
  showMoreRightParents,
  debug,
}) {
  if (debug) console.log(node);

  //delay image rendering every 50 images of about 500ms
  const [showImage, setShowImage] = useState(false);
  const [genderColors, setGenderColors] = useState(false);

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
        height: CARD_HEIGHT,
        padding: CARD_PADDING,
      }}
      className={`Node ${
        focusedNode && focusedNode.treeId === node.treeId ? "focused" : ""
      } ${genderColors ? node.data.extraClass : ""}`}
      onClick={() => setFocusedNode(node)}
    >
      <div
        className="imgWrapper"
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        onClick={nextImage}
      >
        {!images ||
          (!images.length && (
            <span className="defaultImgMessage">no image</span>
          ))}
        {images && !!images.length && (
          <>
            {images[imageIndex] && (
              <img
                alt={images[imageIndex].alt}
                src={images[imageIndex].url}
                title={images[imageIndex].alt}
              />
            )}
            {images && images.length > 1 && (
              <span className="imgMore">+{images.length - 1}</span>
            )}
          </>
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
                <img src={link.iconSrc} alt={link.alt} title={link.alt} />
              </a>
            ))}
          </div>
        )}
      </div>
      {node._parentsExpanded && currentProp && (
        <div className="upPropLabel" style={{ top: -CARD_VERTICAL_GAP / 2 }}>
          <span>{currentProp.label}</span>
        </div>
      )}
      {node._childrenExpanded && currentProp && (
        <div
          className="downPropLabel"
          style={{ bottom: -CARD_VERTICAL_GAP / 2 }}
        >
          <span>{currentProp.label}</span>
        </div>
      )}
      <SiblingCounter
        ids={node.data.leftIds}
        node={node}
        toggleFn={toggleSiblings}
        className="siblingCount"
      />
      <SpouseCounter
        ids={node.data.rightIds}
        node={node}
        toggleFn={toggleSpouses}
        className="spouseCount"
      />
      <ParentCounter
        ids={node.data.upIds}
        node={node}
        toggleFn={toggleParents}
        className="parentCount"
      />
      <ChildCounter
        ids={node.data.downIds}
        node={node}
        toggleFn={toggleChildren}
        className="childrenCount"
      />
      {node.prevIndex && (
        <Button
          className={`prev`}
          variant={"warning"}
          size="sm"
          onClick={() => showMoreLeftParents(node)}
        >
          <BsPlusCircle /> {node.prevIndex} more
        </Button>
      )}
      {node.nextIndex && (
        <Button
          className={`next`}
          variant={"warning"}
          size="sm"
          onClick={() => showMoreRightParents(node)}
        >
          <BsPlusCircle /> {node.parent._allChildren.length - node.nextIndex}{" "}
          more
        </Button>
      )}
    </div>
  );
}

function SiblingCounter({ ids, node, toggleFn, className }) {
  const [disabled, setDisabled] = React.useState(false);
  if (!ids || !ids.length) return null;
  return (
    <Button
      className={`${className} counter`}
      variant={"link"}
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        await toggleFn(node);
        setDisabled(false);
      }}
    >
      <div>
        <div>{ids.length}</div>
        {node._siblingsExpanded ? <FiChevronRight /> : <FiChevronLeft />}
      </div>
    </Button>
  );
}

function ParentCounter({ ids, node, toggleFn, className }) {
  const [disabled, setDisabled] = React.useState(false);
  if (!ids || !ids.length) return null;
  return (
    <Button
      className={`${className} counter`}
      variant={"link"}
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        await toggleFn(node);
        setDisabled(false);
      }}
    >
      <div>
        <span className="mr-1">{ids.length}</span>
        {node._parentsExpanded ? <FiChevronDown /> : <FiChevronUp />}
      </div>
    </Button>
  );
}

function SpouseCounter({ ids, node, toggleFn, className }) {
  const [disabled, setDisabled] = React.useState(false);
  if (!ids || !ids.length) return null;
  return (
    <Button
      className={`${className} counter`}
      variant={"link"}
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        await toggleFn(node);
        setDisabled(false);
      }}
    >
      <div>
        <div>{ids.length}</div>
        {node._spousesExpanded ? (
          <FiChevronLeft />
        ) : (
          <>
            <FiChevronRight />
          </>
        )}
      </div>
    </Button>
  );
}

function ChildCounter({ ids, node, toggleFn, className }) {
  const [disabled, setDisabled] = React.useState(false);
  if (!ids || !ids.length) return null;
  return (
    <Button
      className={`${className} counter`}
      variant={"link"}
      disabled={disabled}
      onClick={async () => {
        setDisabled(true);
        await toggleFn(node);
        setDisabled(false);
      }}
    >
      <div>
        <span className="mr-1">{ids.length}</span>
        {node._childrenExpanded ? <FiChevronUp /> : <FiChevronDown />}
      </div>
    </Button>
  );
}
