import React from "react";
import {
  Navbar,
  Nav,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaCreativeCommons, FaGithub } from "react-icons/fa";
import "./Footer.scss";

export default function Footer() {
  return (
    <Navbar className="Footer" bg="light" expand="lg">
      <Container>
        <Nav className="mr-auto">
          <OverlayTrigger
            overlay={
              <Tooltip>
                Most of what you see comes from Wikidata, if you want to
                change/add data you can collaborate directly on Wikidata
              </Tooltip>
            }
          >
            <Navbar.Brand
              id="wikidata-logo"
              target="_blank"
              href="https://www.wikidata.org"
            >
              <img
                height="30"
                src={"/powered-by-wikidata-light.png"}
                alt="Powered By Wikidata"
              />
            </Navbar.Brand>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={
              <Tooltip>
                You can copy charts and publish them freely as long as you
                mention entitree.com
              </Tooltip>
            }
          >
            <Nav.Link
              target="_blank"
              href="https://creativecommons.org/licenses/by-sa/4.0/deed.en"
            >
              <FaCreativeCommons />
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={
              <Tooltip>
                Click here to see the source code of the project and submit
                suggestions!
              </Tooltip>
            }
          >
            <Nav.Link
              target="_blank"
              href="https://github.com/ogroppo/entitree"
            >
              <FaGithub />
            </Nav.Link>
          </OverlayTrigger>
          <Nav.Item id="twitterFollowButton">
            <a
              href={`https://twitter.com/EntitreeApp?ref_src=twsrc%5Etfw`}
              className="twitter-follow-button"
              // data-size="large"
              // data-show-screen-name=""
              // data-show-count=""
            >
              Follow EntiTree
            </a>
          </Nav.Item>
        </Nav>
        <Nav className="ml-auto rightLinks">
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/privacy">Privacy</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
