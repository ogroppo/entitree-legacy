import "./DetailsModal.scss";

import { Button, Modal } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "../../App";
import { FiExternalLink } from "react-icons/fi";
import getItemsLabel from "../../wikidata/getItemsLabel";
import getWikipediaArticle from "../../wikipedia/getWikipediaArticle";
import { missingImagesLink } from "../../services/imageServer";

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
        <Modal.Title>
          {node.data.label}
          {node.data.secondLabel && (
            <>
              <span className="labelsecondLabel">
                &nbsp;({node.data.secondLabel})
              </span>
            </>
          )}
        </Modal.Title>
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

        <a
          className="addImagesLink"
          target="_blank"
          rel="noopener noreferrer"
          href={missingImagesLink(node.data.id, node.data.label)}
        >
          Add missing image <FiExternalLink />
        </a>

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
          {/*{node.data.wikipediaUrl && (*/}
          {/*  <a*/}
          {/*    target="_blank"*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    title="Open Wikipedia article in a new tab"*/}
          {/*    href={`https://peoplepill.com/people/${node.data.peoplepillSlug}`}*/}
          {/*  >*/}
          {/*    <img src="/icons/pp.png" alt="PeoplePill" />*/}
          {/*  </a>*/}
          {/*)}*/}
          {node.data.fandomUrl && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              title="Open Fandom article in a new tab"
              href={node.data.fandomUrl}
            >
              <svg className="wds-icon">
                <svg id="wds-company-logo-fandom-heart" viewBox="0 0 35 35">
                  <path
                    d="M32.003 16.524c0 .288-.115.564-.32.768L18.3 30.712c-.226.224-.454.324-.738.324-.292 0-.55-.11-.77-.325l-.943-.886a.41.41 0 0 1-.01-.59l15.45-15.46c.262-.263.716-.078.716.29v2.46zm-17.167 10.12l-.766.685a.642.642 0 0 1-.872-.02L3.01 17.362c-.257-.25-.4-.593-.4-.95v-1.858c0-.67.816-1.007 1.298-.536l10.814 10.56c.188.187.505.57.505 1.033 0 .296-.068.715-.39 1.035zM5.73 7.395L9.236 3.93a.421.421 0 0 1 .592 0l11.736 11.603a3.158 3.158 0 0 1 0 4.5l-3.503 3.462a.423.423 0 0 1-.59 0L5.732 11.89a3.132 3.132 0 0 1-.937-2.25c0-.85.332-1.65.935-2.246zm13.89 1.982l3.662-3.62a3.232 3.232 0 0 1 2.737-.897c.722.098 1.378.47 1.893.978l3.708 3.667a.41.41 0 0 1 0 .585l-5.64 5.576a.419.419 0 0 1-.59 0l-5.77-5.704a.411.411 0 0 1 0-.585zm14.56-.687L26.014.475a.869.869 0 0 0-1.228-.002L18.307 6.94c-.5.5-1.316.5-1.82.004l-6.48-6.4A.87.87 0 0 0 8.793.542L.447 8.67C.16 8.95 0 9.33 0 9.727v7.7c0 .392.158.77.44 1.048l16.263 16.072a.87.87 0 0 0 1.22 0l16.25-16.073c.28-.278.438-.655.438-1.048V9.73c0-.39-.153-.763-.43-1.04z"
                    fill="#00D6D6"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </svg>
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
