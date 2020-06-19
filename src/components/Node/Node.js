import React from "react";
import {
  IMAGE_HEIGHT,
  CARD_INNER_WIDTH,
  CARD_WIDTH,
  CARD_OUTER_WIDTH,
} from "../../constants/tree";
import { Button } from "react-bootstrap";
import { FaUsers } from "react-icons/fa";
import "./Node.scss";

export default function Node({
  node,
  toggleParents,
  toggleChildren,
  toggleSiblings,
  toggleSpouses,
  debug,
}) {
  if (debug) console.log(node);
  function toggleImage() {
    node.data.imageState++;
    if (node.data.imageState >= node.data.images.length) {
      node.data.imageState = 0; //reset counter
    }
  }

  return (
    <div
      style={{
        left: node.x,
        top: node.y,
        width: CARD_WIDTH,
      }}
      className="Node"
    >
      <div
        className="img"
        style={{ height: IMAGE_HEIGHT, width: IMAGE_HEIGHT }}
        onClick={() => {
          toggleImage();
        }}
      >
        {node.data.images[0] && (
          <img
            alt={node.data.images[0].alt}
            src={node.data.images[node.data.imageState].url}
            title={node.data.images[node.data.imageState].source}
          />
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
            title={node.data.label}
            href={`https://www.wikidata.org/wiki/${node.data.id}`}
          >
            {node.data.label}
          </a>
        </div>
        <div className="description" title={node.data.description}>
          {node.data.description}
        </div>
        <div className="dates">
          {node.data.birthDate}
          {node.data.birthDate && node.data.deathDate && " - "}
          {node.data.deathDate && node.data.deathDate}
        </div>
        <div
          className="rest"
          dangerouslySetInnerHTML={{ __html: node.data.html }}
        ></div>
      </div>
      <Counter
        ids={node.extraSiblingIds}
        node={node}
        toggleFn={toggleSiblings}
        className="siblingCount"
      />
      <Counter
        ids={node.extraSpouseIds}
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
