import React, { useState, useEffect, useRef, useContext } from "react";
import { AppContext } from "../../App";
import { FiExternalLink } from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import getItem from "../../wikidata/getItem";
import getData from "../../axios/getData";

export default function DetailsModal({ node, hideModal }) {
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

    if (node.data.birthPlaceId) {
      getItem(node.data.birthPlaceId, currentLang.code).then(({ label }) => {
        setBirthPlace(label);
      });
    }
    if (node.data.deathPlaceId) {
      getItem(node.data.deathPlaceId, currentLang.code).then(({ label }) => {
        setDeathPlace(label);
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

        {/*{node.data.sitelink && node.data.sitelink.url && (*/}
        {/*  <p>*/}
        {/*    <a href={node.data.sitelink.url} target="_blank">*/}
        {/*      Open Wikipedia page <FiExternalLink />*/}
        {/*    </a>*/}
        {/*  </p>*/}
        {/*)}*/}
        {/*<p>*/}
        {/*  <a href={node.data.wikidataUrl} target="_blank">*/}
        {/*    Open Wikidata item <FiExternalLink />*/}
        {/*  </a>*/}
        {/*</p>*/}
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
        <Button variant="primary" onClick={hideModal}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
