import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Footer.scss";
export default function Footer() {
  return (
    <Navbar className="Footer" bg="light" expand="lg">
      <Container>
        <Navbar.Brand target="_blank" href="https://www.wikidata.org">
          <img
            height="30"
            src={"/powered-by-light.svg"}
            alt="Powered By Wikidata"
          />
        </Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="/about">About</Nav.Link>
          {/* <Nav.Link href="/privacy">Privacy</Nav.Link> */}
        </Nav>
      </Container>
    </Navbar>
  );
}
