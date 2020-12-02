import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../App";
import { FiExternalLink } from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import getItemsLabel from "../../wikidata/getItemsLabel";
import missingImagesLink from "../../lib/imageDatabase";
import getWikipediaArticle from "../../wikipedia/getWikipediaArticle";
import "./DetailsModal.scss";

export default function DetailsModal({ node, hideModal, nodeImages }) {
  const { currentLang, setCurrentEntityId, currentEntity } = useContext(
    AppContext
  );

  const [images, setImages] = useState(nodeImages);
  const [birthPlace, setBirthPlace] = useState();
  const [deathPlace, setDeathPlace] = useState();
  const [wikipediaExtract, setWikipediaExtract] = useState();

  useEffect(() => {
    if (node.data.wikipediaSlug)
      getWikipediaArticle(node.data.wikipediaSlug, currentLang.code).then(
        ({ extract, thumbnail }) => {
          if (extract) setWikipediaExtract(extract);
          if (thumbnail && !images.length) {
            setImages({
              url: thumbnail.source,
              alt: `${node.data.label}'s Wikipedia image`,
            });
          }
        }
      );
  }, [
    currentLang.code,
    images.length,
    node.data.wikipediaSlug,
    node.data.label,
  ]);

  useEffect(() => {
    if (node.data.birthPlaceId || node.data.deathPlaceId) {
      getItemsLabel(
        [node.data.birthPlaceId, node.data.deathPlaceId],
        currentLang.code
      ).then(([birthPlaceLabel, deathPlaceLabel]) => {
        setBirthPlace(birthPlaceLabel);
        setDeathPlace(deathPlaceLabel);
      });
    }
  }, [currentLang.code, node.data.birthPlaceId, node.data.deathPlaceId]);

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
        {/*{!images.length && (*/}
        <a
          className="addImages"
          target="_blank"
          rel="noopener noreferrer"
          href={missingImagesLink(node.data.id, node.data.label)}
        >
          Add missing image
        </a>
        {/*)}*/}
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
            <a
              href={node.data.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open official website <FiExternalLink />
            </a>
          </p>
        )}
        <div className="externalLinks">
          {node.data.wikidataUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Wikidata item in a new tab"
              href={node.data.wikidataUrl}
            >
              <img src="/icons/wikidata.png" alt="Wikidata" />
            </a>
          )}
          {node.data.wikipediaUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Wikipedia article in a new tab"
              href={node.data.wikipediaUrl}
            >
              <img src="/icons/wikipedia.png" alt="Wikipedia" />
            </a>
          )}
          {node.data.externalLinks?.map((link, index) => (
            <a
              key={node.treeId + index}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              href={link.url}
            >
              <img src={link.iconSrc} alt={link.alt} />
            </a>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {node.data.id !== currentEntity.id && (
          <Button
            variant="light"
            className="mr-auto"
            onClick={() => {
              setCurrentEntityId(node.data.id);
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
