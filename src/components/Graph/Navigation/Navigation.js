import { Button, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import ReactGA from "react-ga";
import React, { useState } from "react";
import { FiMinus, FiPlus, FiPrinter } from "react-icons/fi";
import { FaRegShareSquare } from "react-icons/fa";
import { IoMdExpand } from "react-icons/io";
import { RiFocus3Line } from "react-icons/ri";
import {
  FacebookShareButton,
  RedditShareButton,
  TelegramShareButton,
  TwitterShareButton,
  PinterestShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  RedditIcon,
  PinterestIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import "./Navigation.scss";

export default function Navigation({
  zoomIn,
  zoomOut,
  focusedNode,
  recenter,
  fitTree,
}) {
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const zoomInWrapper = (e) => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomIn",
    });
    zoomIn(e);
  };
  const zoomOutWrapper = (e) => {
    ReactGA.event({
      category: "Navigation",
      action: "zoomOut",
    });
    zoomOut(e);
  };
  const recenterWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "recenter",
      label: focusedNode.data.label,
    });
    recenter();
  };
  const fitTreeWrapper = () => {
    ReactGA.event({
      category: "Navigation",
      action: "fitTree",
    });
    fitTree();
  };
  return (
    <div className="Navigation">
      <OverlayTrigger placement="right" overlay={<Tooltip>Zoom in</Tooltip>}>
        <Button variant="light" onClick={zoomInWrapper}>
          <FiPlus />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="right" overlay={<Tooltip>Zoom out</Tooltip>}>
        <Button variant="light" onClick={zoomOutWrapper}>
          <FiMinus />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            Center tree on {focusedNode && focusedNode.data.label}
          </Tooltip>
        }
      >
        <Button
          variant="light"
          onClick={recenterWrapper}
          disabled={!focusedNode}
        >
          <RiFocus3Line />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>Fit tree to screen</Tooltip>}
      >
        <Button variant="light" onClick={fitTreeWrapper}>
          <IoMdExpand />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="right" overlay={<Tooltip>Share</Tooltip>}>
        <Button variant="light" onClick={() => setShowShareTooltip(true)}>
          <FaRegShareSquare />
        </Button>
      </OverlayTrigger>
      {showShareTooltip && (
        <Modal
          show={true}
          centered
          onHide={() => setShowShareTooltip(false)}
          className="ShareModal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Share this tree</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="shareButton">
              <FacebookShareButton
                url={window.location.href}
                quote={focusedNode.data.description}
                hashtag="entitree"
              >
                <FacebookIcon /> Share on Facebook
              </FacebookShareButton>
            </div>
            <div className="shareButton">
              <TwitterShareButton
                url={window.location.href}
                title={document.title}
                hashtags={["entitree"]}
              >
                <TwitterIcon /> Share on Twitter
              </TwitterShareButton>
            </div>
            <div
              className="shareButton"
              url={window.location.href}
              media={
                focusedNode.data.images[0]
                  ? focusedNode.data.images[0].url
                  : null
              }
              description={focusedNode.data.description}
            >
              <PinterestShareButton>
                <PinterestIcon /> Share on Pinterest
              </PinterestShareButton>
            </div>
            <div className="shareButton">
              <RedditShareButton
                url={window.location.href}
                title={document.title}
              >
                <RedditIcon /> Share on Reddit
              </RedditShareButton>
            </div>
            <div className="shareButton">
              <WhatsappShareButton
                url={window.location.href}
                title={document.title}
              >
                <WhatsappIcon /> Share on Whatsapp
              </WhatsappShareButton>
            </div>
            <div className="shareButton">
              <TelegramShareButton
                url={window.location.href}
                title={document.title}
              >
                <TelegramIcon /> Share on Telegram
              </TelegramShareButton>
            </div>
            <div className="shareButton">
              <Button
                variant="none"
                onClick={async () => {
                  await setShowShareTooltip(false);
                  window.print();
                }}
              >
                <FiPrinter /> Print this page
              </Button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowShareTooltip(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
