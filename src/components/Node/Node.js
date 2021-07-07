import "./Node.scss";

import {
  CHILD_ID,
  EYE_COLOR_ID,
  HAIR_COLOR_ID,
  GENI_ID,
  INSTAGRAM_ID,
  WIKITREE_ID,
  COUNTRY_OF_CITIZENSHIP,
  RELIGION_ID,
  OCCUPATION_ID,
} from "../../constants/properties";
import {
  DOWN_SYMBOL,
  LEFT_SYMBOL,
  RIGHT_SYMBOL,
  UP_SYMBOL,
} from "../../constants/tree";
import { FaEye, FaFemale, FaMale, FaUser } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
} from "react-icons/fi";
import { IMAGE_SERVER_BASE_URL, imageServer } from "../../services/imageServer";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import { RiGroupLine, RiParentLine } from "react-icons/ri";
import styled, { useTheme } from "styled-components";

import { AppContext } from "../../App";
import { BsImage } from "react-icons/bs";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import DetailsModal from "../../modals/DetailsModal/DetailsModal";
import { GiBigDiamondRing } from "react-icons/gi";
import { GiPerson } from "react-icons/gi";
import { MdChildCare } from "react-icons/md";
import clsx from "clsx";
import colorByProperty from "../../wikidata/colorByProperty";
import countryByQid from "../../wikidata/countryByQid";
import getGeniData from "../../geni/getGeniData";
import { getFandomPageProps } from "../../wikidata/getFandomImages";
import getSimpleClaimValue from "../../lib/getSimpleClaimValue";
// import getWikitreeImageUrl from "../../wikitree/getWikitreeImageUrl";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import addLifeSpan from "../../lib/addLifeSpan";
import religionByQid from "../../wikidata/religionByQid";
import { isValidImage } from "../../lib/isValidImage";
import occupationByQid from "../../wikidata/occupationByQid";

export default memo(function Node({
  node,
  currentProp,
  toggleParents,
  toggleChildren,
  toggleSiblings,
  toggleSpouses,
  setFocusedNode,
  focusedNode,
  debug,
}) {
  if (debug) console.log(node);

  const [showModal, setShowModal] = useState(false);
  const [thumbnails, setThumbnails] = useState(node.data.thumbnails);
  const [lifeSpanInYears, setLifeSpanInYears] = useState(
    node.data.lifeSpanInYears
  );
  const [birthCountry, setBirthCountry] = useState(
    countryByQid(node.data.simpleClaims[COUNTRY_OF_CITIZENSHIP])
  );
  const [images, setImages] = useState(node.data.images);
  const [faceImage, setFaceImage] = useState();
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const theme = useTheme();
  const location = useLocation();
  const { settings, secondLabel } = useContext(AppContext);

  const hideModal = () => {
    setShowModal(false);
  };

  //helper function needed to improve the line-clamp by moving the class to the smaller div to prevent "..." at the last line
  const hasLabelOnly = theme.descriptionDisplay === "none" && !secondLabel;

  const eyeColor = useMemo(
    () => colorByProperty(node.data.simpleClaims[EYE_COLOR_ID]),
    [node.data.simpleClaims]
  );

  const hairColor = useMemo(
    () => colorByProperty(node.data.simpleClaims[HAIR_COLOR_ID]),
    [node.data.simpleClaims]
  );

  const religion = useMemo(
    () => religionByQid(node.data.simpleClaims[RELIGION_ID]),
    [node.data.simpleClaims]
  );

  const occupation = useMemo(
    () =>
      renderOccupations(occupationByQid(node.data.simpleClaims[OCCUPATION_ID])),
    [node.data.simpleClaims]
  );

  function renderOccupations(occ) {
    const listItems = occ.map((entry) => (
      <span title={entry.itemLabel}>{entry.emoji}</span>
    ));
    return <div>{listItems}</div>;
  }

  const getFlag = (c) =>
    String.fromCodePoint(
      ...[...c.toUpperCase()].map((x) => 0x1f1a5 + x.charCodeAt())
    );

  const useEmoji = false;

  useEffect(() => {
    // check if node QID is in url params and toggle accrodingly
    const urlIds = queryString.parse(location.search);
    if (urlIds[node.data.id]) {
      if (urlIds[node.data.id].indexOf(UP_SYMBOL) > -1 && node.isParent)
        toggleParents(node, { noRecenter: true });
      if (urlIds[node.data.id].indexOf(DOWN_SYMBOL) > -1 && node.isChild)
        toggleChildren(node, { noRecenter: true });
      if (urlIds[node.data.id].indexOf(LEFT_SYMBOL) > -1 && node.isParent)
        toggleSiblings(node, { noRecenter: true });
      if (urlIds[node.data.id].indexOf(RIGHT_SYMBOL) > -1 && node.isChild)
        toggleSpouses(node, { noRecenter: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //should this also go under the showExternalImages settings?!
    var numericId = node.data.id.substr(1);
    imageServer
      .get(`/api/v1/image/info/wikidata/${numericId}`)
      .then(({ images }) => {
        images.forEach((dpImg) => {
          // const dpImg = data.images[0];
          let descr = `${dpImg.uploadSite}\nImage Database`;
          if (dpImg.comment) {
            descr += `\n${dpImg.comment}`;
          }
          if (dpImg.recordedDate) {
            descr += `\nPhoto taken in ${dpImg.recordedDate.substr(0, 4)}`;
          }
          if (dpImg.sourceUrl) {
            descr += `\n\n${dpImg.sourceUrl}`;
          }
          //this will set always last image?!
          setFaceImage({
            url: `${IMAGE_SERVER_BASE_URL}/api/v1/image/facecrop/id/${dpImg.id}`,
            alt: descr,
            imageDb: true,
          });
          setThumbnails((thumbnails) => [
            {
              url: `${IMAGE_SERVER_BASE_URL}/api/v1/image/thumbnail/id/${dpImg.id}`,
              alt: descr,
              imageDb: true,
            },
            ...thumbnails, //as the imageServer assets might be more accurate, use them first
          ]);
          setImages((images) => [
            {
              url: `${IMAGE_SERVER_BASE_URL}/api/v1/image/thumbnail/id/${dpImg.id}`,
              alt: descr,
              imageDb: true,
            },
            ...images, //as the imageServer assets might be more accurate, use them first
          ]);
        });
      })
      .catch();

    if (settings.showExternalImages) {
      //user all images
      // if(node.data.fandomHost){
      //   getFandomImages(node.data.fandomHost,node.data.fandomId)
      //     .then((fandomData) => {
      //       // console.log(fandomData);
      //       if (
      //         fandomData &&
      //         fandomData.query &&
      //         fandomData.query.pages &&
      //         fandomData.query.pages
      //       ) {
      //         const page = Object.values(fandomData.query.pages)[0];
      //
      //
      //         // page.images.forEach((oneImage) => {
      //         if (page.images &&
      //           page.images[0].title) {
      //           const allFilenames = page.images.map(key => key.title).join("|");
      //           console.log(allFilenames);
      //           getFandomImageUrl(node.data.fandomHost, allFilenames).then((fandomImageData) => {
      //             console.log(fandomImageData);
      //             Object.values(fandomImageData.query.pages).forEach((oneImage) => {
      //               if(oneImage.imageinfo && oneImage.imageinfo[0]){
      //               const fandomImage = {
      //                 url: oneImage.imageinfo[0].url.split("/revision/")[0],
      //                 alt: `Fandom image, ${oneImage.title}`,
      //                 source: node.data.fandomUrl
      //               };
      //               setThumbnails((thumbnails) => thumbnails.concat(fandomImage));
      //               setImages((images) => images.concat(fandomImage));
      //               }
      //             });
      //           });
      //         }
      //       }
      //     });
      // }

      if (node.data.fandomHost) {
        getFandomPageProps(node.data.fandomHost, node.data.fandomId).then(
          (fandomData) => {
            // console.log(fandomData);
            if (fandomData && fandomData.query && fandomData.query.pages) {
              const page = Object.values(fandomData.query.pages)[0];
              console.log(page);

              // page.images.forEach((oneImage) => {
              if (page.pageprops) {
                const pageprops = JSON.parse(page.pageprops.infoboxes);
                console.log(pageprops);
                if (pageprops[0] && pageprops[0].data) {
                  const image = pageprops[0].data.find(
                    (entry) => entry.type === "image"
                  ).data[0];
                  console.log(image);

                  if (image) {
                    const fandomImage = {
                      url: image.url.split("/revision/")[0],
                      alt: `Fandom image, ${image.name}`,
                      source: node.data.fandomUrl,
                    };
                    setThumbnails((thumbnails) =>
                      thumbnails.concat(fandomImage)
                    );
                    setImages((images) => images.concat(fandomImage));
                  }
                }
              }
            }
          }
        );
      }
      /* DISABLE WIKITREE, SINCE CORS DOESN'T WORK
      const wikitreeId = getSimpleClaimValue(
        node.data.simpleClaims,
        WIKITREE_ID
      );
      if (wikitreeId) {
        getWikitreeImageUrl(wikitreeId)
          .then((wikitreeImageUrl) => {
            if (wikitreeImageUrl) {
              const img = {
                url: wikitreeImageUrl,
                alt: `Wikitree.com image`,
              };
              setThumbnails(thumbnails.concat(img));
              setImages(images.concat(img));
            }
          })
          .catch();
      }
      */

      if (node.data.peoplepillImageUrl) {
        isValidImage(node.data.peoplepillImageUrl).then((valid) => {
          if (valid) {
            const ppImage = {
              url: node.data.peoplepillImageUrl,
              alt: `Image from peoplepill`,
            };
            setThumbnails((images) => [ppImage, ...images]);
            setImages((images) => [ppImage, ...images]);
          }
        });
      }

      const geniId = getSimpleClaimValue(node.data.simpleClaims, GENI_ID);
      if (geniId) {
        getGeniData(geniId)
          .then((geniData) => {
            if (
              geniData &&
              geniData.mugshot_urls &&
              geniData.mugshot_urls.thumb
            ) {
              const geniImg = {
                url: geniData.mugshot_urls.thumb,
                alt: `Geni.com image`,
              };
              setThumbnails((thumbnails) => thumbnails.concat(geniImg));
              setImages((images) => images.concat(geniImg));
            }
            if (
              geniData &&
              (geniData.birth || geniData.death) &&
              node.data.lifeSpanInYears === undefined
            ) {
              if (geniData.birth && geniData.birth.date) {
                geniData.birthYear = geniData.birth.date.year;
                if (
                  geniData.birth.date.circa &&
                  geniData.birth.date.circa === true
                ) {
                  geniData.birthYear = "~" + geniData.birthYear;
                }
              }
              if (geniData.death && geniData.death.date) {
                geniData.deathYear = geniData.death.date.year;
                if (
                  geniData.death.date.circa &&
                  geniData.death.date.circa === true
                ) {
                  geniData.deathYear = "~" + geniData.deathYear;
                }
              }
              addLifeSpan(geniData);
              setLifeSpanInYears(geniData.lifeSpanInYears);
            }
            if (
              geniData &&
              geniData.birth &&
              geniData.birth.location &&
              geniData.birth.location.country_code &&
              !birthCountry
            ) {
              setBirthCountry({
                code: geniData.birth.location.country_code,
                name: geniData.birth.location.country,
                text: "Born in " + geniData.birth.location.country + " (geni)",
              });
            } else if (
              geniData &&
              geniData.location &&
              geniData.location.country_code &&
              !birthCountry
            ) {
              setBirthCountry({
                code: geniData.location.country_code,
                name: geniData.location.country,
                text: "Lived in " + geniData.location.country + " (geni)",
              });
            }
          })
          .catch();
      }

      /* ERROR REDIRECT
      const instagramUsername = getSimpleClaimValue(
        node.data.simpleClaims,
        INSTAGRAM_ID
      );
      if (instagramUsername) {
        getData(`https://www.instagram.com/${instagramUsername}/?__a=1`)
          .then((data) => {
            if (data.graphql && data.graphql.user.profile_pic_url) {
              const instagramImage = {
                url: data.graphql.user.profile_pic_url,
                alt: `Instagram profile pic of ${instagramUsername}`,
              };
              setThumbnails(thumbnails.concat(instagramImage));
              setImages(images.concat(instagramImage));
            }
          })
          .catch();
      }
      */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    data: { gender, isHuman },
  } = node;

  const currentThumbnail = thumbnails[thumbnailIndex];

  const onThumbClick =
    thumbnails.length > 1
      ? () => setThumbnailIndex((thumbnailIndex + 1) % thumbnails.length)
      : null;

  const hasSecondLabel =
    secondLabel &&
    node.data.secondLabel &&
    node.data.label !== node.data.secondLabel;
  return (
    <ThemedNodeOuter
      style={{
        left: node.x,
        top: node.y,
      }}
      className={clsx("Node", {
        focused: focusedNode && focusedNode.treeId === node.treeId,
        [gender]: gender,
      })}
      onClick={() => setFocusedNode(node)}
      //data-id={node.data.id}
      //data-tree-id={node.treeId}
    >
      {/*  { node.childNumber && (
    <span
      className="childNumber"
      style={{
        position: "absolute",
        top: "-20px",
      }}
    >
      { node.childNumber }
    </span>
      ) }
      */}
      <ThemedNodeInner>
        {theme.thumbDisplay && (
          <ThemedThumbnail
            className={clsx("imgWrapper", {
              hasThumbnails: thumbnails.length > 1,
            })}
            onClick={onThumbClick}
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
            {currentThumbnail && (
              <>
                {currentThumbnail.imageDb && settings.showFace && faceImage ? (
                  <img
                    alt={faceImage.alt}
                    src={
                      faceImage.url +
                      (settings.imageType === "head" ? "?factor=1.5" : "")
                    }
                    title={faceImage.alt}
                  />
                ) : (
                  <img
                    alt={currentThumbnail.alt}
                    src={currentThumbnail.url}
                    title={currentThumbnail.alt}
                  />
                )}
                {thumbnails.length > 1 && (
                  <span className="thumbnailCounter">
                    {thumbnailIndex + 1}/{thumbnails.length}
                  </span>
                )}
              </>
            )}
          </ThemedThumbnail>
        )}
        <ThemedContent className="content" hasSecondLabel={hasSecondLabel}>
          {settings.showExtraInfo &&
            settings.extraInfo === "countryFlag" &&
            birthCountry && (
              <div className="flagIcons">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{birthCountry.text}</Tooltip>}
                >
                  <span>
                    {!useEmoji && (
                      <img
                        alt=""
                        src={`https://www.countryflags.io/${birthCountry.code}/flat/32.png`}
                      />
                    )}
                    {useEmoji && <>{getFlag(birthCountry.code)}</>}
                  </span>
                </OverlayTrigger>
              </div>
            )}

          {settings.showExtraInfo && (
            <div className="colorIcons">
              {eyeColor && settings.extraInfo === "eyeColor" && (
                <span
                  className="eyeColor"
                  title={eyeColor.itemLabel + " eyes"}
                  style={{
                    color: "#" + eyeColor.hex,
                  }}
                >
                  <FaEye size={25} />
                </span>
              )}
              {hairColor && settings.extraInfo === "hairColor" && (
                <span
                  className="hairColor"
                  title={hairColor.itemLabel}
                  style={{
                    color: "#" + hairColor.hex,
                  }}
                >
                  <FaUser />
                </span>
              )}
            </div>
          )}

          {settings.showExtraInfo &&
            settings.extraInfo === "religion" &&
            religion && (
              <div
                className="colorIcons"
                title={religion.itemLabel + " (wikidata)"}
              >
                {religion.emoji}
              </div>
            )}
          <div
            className={clsx({
              "four-line-clamp": !hasLabelOnly,
            })}
          >
            {node.isRoot ? (
              <h1
                className={clsx(`label btn btn-link mb-0`, {
                  "four-line-clamp": hasLabelOnly,
                })}
                role="button"
                tabIndex="0"
                onClick={() => setShowModal(true)}
                title={
                  node.data.label ? `Show ${node.data.label} details` : null
                }
              >
                {node.data.birthName && settings.showBirthName ? (
                  node.data.birthName
                ) : node.data.label ? (
                  node.data.label
                ) : (
                  <i>Unlabelled</i>
                )}
              </h1>
            ) : (
              <span
                className={clsx(`label btn btn-link`, {
                  "four-line-clamp": hasLabelOnly,
                })}
                role="button"
                tabIndex="0"
                onClick={() => setShowModal(true)}
                title={
                  node.data.label ? `Show ${node.data.label} details` : null
                }
              >
                {node.data.birthName && settings.showBirthName ? (
                  node.data.birthName
                ) : node.data.label ? (
                  node.data.label
                ) : (
                  <i>Unlabelled</i>
                )}
              </span>
            )}
            {hasSecondLabel && (
              <>
                <br />
                <span className="label labelsecondLabel">
                  {node.data.secondLabel}
                </span>
              </>
            )}
            {node.data.description && theme.descriptionDisplay !== "none" && (
              <>
                <br />
                <span className="description" title={node.data.description}>
                  {node.data.description}
                </span>
              </>
            )}
            {settings.showExtraInfo &&
              settings.extraInfo === "occupation" &&
              occupation && <div className="occupation">{occupation}</div>}
          </div>
          <div className="dates">
            {node.data.lifeSpan || lifeSpanInYears
              ? theme.datesYearOnly
                ? lifeSpanInYears
                : node.data.lifeSpan
              : node.data.startEndSpan
              ? node.data.startEndSpan
              : node.data.inceptionAblishedSpan
              ? node.data.inceptionAblishedSpan
              : ""}
          </div>
        </ThemedContent>
      </ThemedNodeInner>
      {/* {node._parentsExpanded && currentProp && (
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
      )} */}
      {node.data.leftIds && !!node.data.leftIds.length && (
        <Button
          className={`siblingToggle relativeToggle`}
          variant={"link"}
          disabled={node.loadingSiblings}
          onClick={() => toggleSiblings(node)}
          title={(node._siblingsExpanded ? "Collapse" : "Expand") + " siblings"}
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
          className={`spouseToggle relativeToggle`}
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
          className={`parentToggle relativeToggle`}
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
          className={`childrenToggle relativeToggle`}
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
            className={`childrenToggle relativeToggle`}
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
        <DetailsModal hideModal={hideModal} node={node} nodeImages={images} />
      )}
    </ThemedNodeOuter>
  );
});

const ThemedNodeOuter = styled.div`
  box-sizing: content-box;
  border-radius: ${({ theme }) => theme.nodeBorderRadius}px;
  border: ${({ theme }) => theme.nodeBorder};
  box-shadow: ${({ theme }) => theme.nodeBoxShadow};
  &.focused {
    box-shadow: ${({ theme }) => theme.nodeFocusedBoxShadow};
  }
  height: ${({ theme }) => theme.nodeHeight}px;
  width: ${({ theme }) => theme.nodeWidth}px;
  background-color: ${({ theme }) => theme.nodeBackgroundColor};
  display: flex;
  ${({ theme }) => theme.nodeFlexDirection === "row" && `align-items: center`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" && `justify-content: center`};
  ${({ theme }) => theme.nodeCss};
`;

const ThemedNodeInner = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: ${({ theme }) => theme.nodeFlexDirection};
  ${({ theme }) =>
    theme.nodeFlexDirection === "row" && `height: ${theme.thumbHeight}px`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" && `width: ${theme.thumbWidth}px`};
`;

const ThemedThumbnail = styled.div`
  width: ${({ theme }) => theme.thumbWidth}px;
  height: ${({ theme }) => theme.thumbHeight}px;
  border-radius: ${({ theme }) => theme.thumbBorderRadius}px;
  ${({ theme }) =>
    theme.nodeFlexDirection === "row" &&
    `margin-left: ${(theme.nodeHeight - theme.thumbHeight) / 2}px`};
  ${({ theme }) =>
    theme.nodeFlexDirection === "column" &&
    `margin-top: ${(theme.nodeWidth - theme.thumbWidth) / 2}px`};
  .thumbnailCounter {
    display: ${({ theme }) => theme.thumbCounterDisplay};
  }
`;

const ThemedContent = styled.div`
  //use margin to get width 100% calculations eg dates
  margin-left: ${({ theme }) => theme.contentPaddingLeft}px;
  margin-top: ${({ theme }) => theme.contentPaddingTop}px;
  .four-line-clamp {
    -webkit-line-clamp: ${({ theme }) => theme.contentLineClamp};
  }
  .label {
    word-break: break-word;
    text-align: ${({ theme }) => theme.labelTextAlign};
    font-size: ${({ theme }) => theme.labelFontSize}px;
    color: ${({ theme }) => theme.labelFontColor};
    //if there is no description we can have this block and have the dots of the same color of the text
    //but only ONE can be display block
    display: ${({ theme, hasSecondLabel }) =>
      theme.descriptionDisplay === "none" && !hasSecondLabel
        ? "block"
        : "inline"};
  }
  .description {
    //if "block" the dots will have the same color of the text
    display: ${({ theme }) => theme.descriptionDisplay};
  }
  .dates {
    display: ${({ theme }) => theme.datesDisplay};
    text-align: ${({ theme }) => theme.labelTextAlign};
    font-size: ${({ theme }) => theme.datesFontSize}px;
  }
`;
