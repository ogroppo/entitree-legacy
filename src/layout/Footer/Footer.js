import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import "./Footer.scss";
export default function Footer() {
  return (
    <Navbar className="Footer" bg="light" expand="lg">
      <Nav>
        <Nav.Link href="/about">About</Nav.Link>
      </Nav>
    </Navbar>
  );
}
