import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Footer.scss";
export default function Footer() {
  return (
    <Navbar className="Footer" bg="light" expand="lg">
      <Container>
        <Nav>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
