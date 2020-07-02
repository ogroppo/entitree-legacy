import React, { useContext, useState } from "react";
import {
  Navbar,
  Container,
  DropdownButton,
  Dropdown,
  Button,
  Nav,
  FormControl,
} from "react-bootstrap";
import { FiSliders } from "react-icons/fi";

import { EXAMPLES } from "../../constants/examples";
import { AppContext } from "../../App";
import "./Header.scss";
import Logo from "../../components/Logo/Logo";
import Settings from "../../modals/Settings/Settings";

export default function Header() {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  return (
    <Navbar className="Header" bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Logo /> Entitree
        </Navbar.Brand>
        <DropdownButton
          title="Examples"
          variant="info"
          size="sm"
          className="examplesButton"
        >
          {EXAMPLES.map(({ name, href }) => (
            <Dropdown.Item key={name} href={href}>
              {name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <Nav className="ml-auto">
          <Button variant="light" onClick={() => setShowSettingsModal(true)}>
            <FiSliders />
          </Button>
          <Settings
            show={showSettingsModal}
            hideModal={() => setShowSettingsModal(false)}
          />
        </Nav>
      </Container>
    </Navbar>
  );
}
