import React, { useContext, useState } from "react";
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
import { RiGroupLine, RiParentLine } from "react-icons/ri";
import { GiBigDiamondRing } from "react-icons/gi";
import { BsImage } from "react-icons/bs";
import { MdChildCare } from "react-icons/md";
import "./Node.scss";
import {
  CHILD_ID,
  EYE_COLOR_ID,
  HAIR_COLOR_ID,
} from "../../constants/properties";
import DetailsModal from "../../modals/DetailsModal/DetailsModal";
import { FaMale, FaFemale, FaEye } from "react-icons/fa";
import colorByProperty from "../../wikidata/colorByProperty";
import { GiPerson, GiBeard } from "react-icons/gi";
import { AppContext } from "../../App";
import clsx from "clsx";

export default function Node({
  node,
  currentProp,
  toggleParents,
  toggleChildren,
  toggleSiblings,
  toggleSpouses,
  setFocusedNode,
  focusedNode,
  reloadTreeFromFocused,
  debug,
}) {
  if (debug) console.log(node);

  const [showModal, setShowModal] = useState(false);

  const { showBirthName, showEyeHairColors, showFace, imageType } = useContext(
    AppContext
  );

  const hideModal = () => {
    setShowModal(false);
  };

  const {
    data: { thumbnails, gender, isHuman, faceImage },
  } = node;

  const eyeColor = colorByProperty(node.data.simpleClaims[EYE_COLOR_ID]);
  const hairColor = colorByProperty(node.data.simpleClaims[HAIR_COLOR_ID]);

  return (
    <div
      style={{
        left: node.x,
        top: node.y,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: CARD_PADDING,
      }}
      className={clsx("Node", {
        focused: focusedNode && focusedNode.treeId === node.treeId,
        [gender]: gender,
      })}
      onClick={() => setFocusedNode(node)}
    >
      <div
        className="imgWrapper"
        style={{ height: IMAGE_SIZE, width: IMAGE_SIZE }}
        onClick={() => setShowModal(true)}
      >
        {(!thumbnails || !thumbnails.length) && (
          <span className="defaultImgMessage">
            {isHuman && gender ? (
              <>
                {gender === "male" && <FaMale />}
                {gender === "female" && <FaFemale />}
                {gender === "thirdgender" && <GiPerson />}
              </>
            ) : (
              <BsImage />
            )}
          </span>
        )}
        {thumbnails[0] && (
          <span>
            {showFace && faceImage ? (
              <img
                alt={faceImage.alt}
                src={
                  faceImage.url + (imageType === "head" ? "?factor=1.5" : "")
                }
                title={faceImage.alt}
              />
            ) : (
              <img
                alt={thumbnails[0].alt}
                src={thumbnails[0].url}
                title={thumbnails[0].alt}
              />
            )}
          </span>
        )}
      </div>
      <div
        className="content"
        style={{ height: IMAGE_SIZE, width: CARD_CONTENT_WIDTH }}
      >
        {showEyeHairColors && (
          <div
            className="colorIcons"
            style={{
              position: "absolute",
              bottom: 0,
              right: "2px",
            }}
          >
            {eyeColor && (
              <span
                className="eyeColor"
                title={eyeColor.itemLabel + " eyes"}
                style={{
                  color: "#" + eyeColor.hex,
                }}
              >
                <FaEye />
              </span>
            )}
            {hairColor && (
              <span
                className="hairColor"
                title={hairColor.itemLabel}
                style={{
                  color: "#" + hairColor.hex,
                }}
              >
                <GiBeard />
              </span>
            )}
          </div>
        )}
        <div className="four-line-clamp">
          {node.isRoot ? (
            <h1
              className="label btn btn-link"
              role="button"
              tabIndex="0"
              onClick={() => setShowModal(true)}
              title={node.data.label ? `Show ${node.data.label} details` : null}
            >
              {node.data.birthName && showBirthName ? (
                node.data.birthName
              ) : node.data.label ? (
                node.data.label
              ) : (
                <i>Unlabelled</i>
              )}
            </h1>
          ) : (
            <span
              className="label btn btn-link"
              role="button"
              tabIndex="0"
              onClick={() => setShowModal(true)}
              title={node.data.label ? `Show ${node.data.label} details` : null}
            >
              {node.data.birthName && showBirthName ? (
                node.data.birthName
              ) : node.data.label ? (
                node.data.label
              ) : (
                <i>Unlabelled</i>
              )}
            </span>
          )}

          {node.data.description && (
            <>
              <br />
              <span className="description" title={node.data.description}>
                {node.data.description}
              </span>
            </>
          )}
        </div>
        <div className="dates">
          {node.data.lifeSpan
            ? node.data.lifeSpan
            : node.data.startEndSpan
            ? node.data.startEndSpan
            : node.data.inceptionAblishedSpan
            ? node.data.inceptionAblishedSpan
            : ""}
        </div>
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
      {node.data.leftIds && !!node.data.leftIds.length && (
        <Button
          className={`siblingCount counter`}
          variant={"link"}
          disabled={node.loadingSiblings}
          onClick={() => toggleSiblings(node)}
        >
          <div className="value">{node.data.leftIds.length}</div>
          <div className="chevron mt-1 mb-1">
            {node._siblingsExpanded ? <FiChevronRight /> : <FiChevronLeft />}
          </div>
          <div className="icon">
            <RiGroupLine />
          </div>
        </Button>
      )}
      {node.data.rightIds && !!node.data.rightIds.length && (
        <Button
          className={`spouseCount counter`}
          variant={"link"}
          disabled={node.loadingSpouses}
          onClick={() => toggleSpouses(node)}
          title={(node._spousesExpanded ? "Collapse" : "Expand") + " spouses"}
        >
          <div className="value">{node.data.rightIds.length}</div>
          <div className="chevron mt-1 mb-1">
            {node._spousesExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </div>
          <div className="icon">
            <GiBigDiamondRing />
          </div>
        </Button>
      )}
      {node.data.upIds && !!node.data.upIds.length && (
        <Button
          className={`parentCount counter`}
          variant={"link"}
          disabled={node.loadingParents}
          onClick={() => toggleParents(node)}
        >
          <span className="value">{node.data.upIds.length}</span>
          <span className="chevron ml-1 mr-1">
            {node._parentsExpanded ? <FiChevronDown /> : <FiChevronUp />}
          </span>
          {currentProp && currentProp.id === CHILD_ID && (
            <span className="icon">
              <RiParentLine />
            </span>
          )}
        </Button>
      )}
      {node.data.downIds && !!node.data.downIds.length && (
        <Button
          className={`childrenCount counter`}
          variant={"link"}
          disabled={node.loadingChildren}
          onClick={() => toggleChildren(node)}
        >
          <span className="value">{node.data.childrenCount}</span>
          <span className="chevron ml-1 mr-1">
            {node._childrenExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </span>
          {currentProp && currentProp.id === CHILD_ID && (
            <span className="icon">
              <MdChildCare />
            </span>
          )}
        </Button>
      )}
      {node.data.downIds &&
        !node.data.downIds.length &&
        !!node.data.childrenCount &&
        node.data.childrenCount > 0 &&
        currentProp &&
        currentProp.id === CHILD_ID && (
          <Button
            className={`childrenCount counter`}
            variant={"link"}
            title={"Children not available, please add them on wikidata.org"}
          >
            <span className="value">{node.data.childrenCount}</span>
            <span className="icon">
              <MdChildCare />
            </span>
          </Button>
        )}
      {showModal && (
        <DetailsModal
          hideModal={hideModal}
          node={node}
          reloadTreeFromFocused={reloadTreeFromFocused}
        />
      )}
    </div>
  );
}
