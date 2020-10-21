import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../../App";
import { FiExternalLink } from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import { getLabels } from "../../wikidata/getItems";
import getData from "../../axios/getData";
import missingImagesLink from "../../lib/imageDatabase";
export default function DetailsModal({
  node,
  hideModal,
  reloadTreeFromFocused,
}) {
  const { currentLang } = useContext(AppContext);
  const [images, setImages] = useState(node.data.images);
  const [birthPlace, setBirthPlace] = useState();
  const [deathPlace, setDeathPlace] = useState();
  const [wikipediaExtract, setWikipediaExtract] = useState();

  useEffect(() => {
    if (node.data.wikipediaSlug)
      getData(
        `https://${currentLang.code}.wikipedia.org/api/rest_v1/page/summary/${node.data.wikipediaSlug}`
      ).then(({ extract, thumbnail }) => {
        if (extract) setWikipediaExtract(extract);
        if (thumbnail && !images.length) {
          setImages({
            url: thumbnail.source,
            alt: `${node.data.label}'s Wikipedia image`,
          });
        }
      });

    if (node.data.birthPlaceId || node.data.deathPlaceId) {
      getLabels([node.data.birthPlaceId, node.data.deathPlaceId], currentLang.code).then(entities => {
        if (node.data.birthPlaceId) {
          setBirthPlace(entities[node.data.birthPlaceId].labels[currentLang.code].value);
        }
        if (node.data.deathPlaceId) {
          setDeathPlace(entities[node.data.deathPlaceId].labels[currentLang.code].value);
        }
      });
    }
  }, []);

  return (
    <Modal show={true} onHide={hideModal} className="DetailsModal">
      <Modal.Header closeButton>
        <Modal.Title>{node.data.label}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!!images.length && (
          <div className="allImages">
            {images &&
              images.map((image) => (
                <img
                  key={image.url}
                  alt={image.alt}
                  src={image.url}
                  title={image.alt}
                />
              ))}
          </div>
        )}
        {!images.length && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={missingImagesLink(node.data.id, node.data.label)}
          >
            Add missing image
          </a>
        )}
        {(node.data.birthDate ||
          birthPlace ||
          node.data.deathDate ||
          deathPlace) && (
          <p>
            <i>
              {node.data.birthDate} {birthPlace}
              {(node.data.deathDate || deathPlace) && (
                <>
                  {" "}
                  - {node.data.deathDate} {deathPlace}
                </>
              )}
            </i>
          </p>
        )}
        <p>
          {wikipediaExtract || node.data.description || (
            <i>This entity has no description</i>
          )}
        </p>

        {node.data.website && (
          <p>
            <a href={node.data.website} target="_blank">
              Open official website <FiExternalLink />
            </a>
          </p>
        )}
        {node.data.externalLinks && !!node.data.externalLinks.length && (
          <div className="externalLinks">
            {node.data.externalLinks.map((link, index) => (
              <a
                key={node.treeId + index}
                target="_blank"
                title={link.title}
                href={link.url}
              >
                <img src={link.iconSrc} alt={link.alt} title={link.title} />
              </a>
            ))}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {reloadTreeFromFocused && (
          <Button
            variant="light"
            className="mr-auto"
            onClick={() => {
              reloadTreeFromFocused();
              hideModal();
            }}
          >
            Show tree from here
          </Button>
        )}
        <Button variant="primary" onClick={hideModal}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
