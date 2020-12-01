import React, { useState } from "react";
import {
  Navbar,
  Container,
  DropdownButton,
  Dropdown,
  Button,
  Nav,
} from "react-bootstrap";
import { FiSliders } from "react-icons/fi";
import ReactGA from "react-ga";
import { EXAMPLES } from "../../constants/examples";
import "./Header.scss";
import Logo from "../../components/Logo/Logo";
import SettingsModal from "../../modals/SettingsModal/SettingsModal";
import { SITE_NAME } from "../../constants/meta";
import styled from "styled-components";

export default function Header({ simple }) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const openSettingsModal = () => {
    ReactGA.modalview("settings");
    setShowSettingsModal(true);
  };

  const openExampleLink = (e) => {
    ReactGA.event({
      category: "Examples",
      action: "Clicked on example",
      label: e.target.href,
    });
  };

  return (
    <ThemedHeader className="Header" bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Logo /> {SITE_NAME}
        </Navbar.Brand>
        {!simple && (
          <DropdownButton
            title="Examples"
            variant="info"
            size="sm"
            className="examplesButton"
          >
            {EXAMPLES.map(({ name, href }) => (
              <Dropdown.Item key={name} href={href} onClick={openExampleLink}>
                {name}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        )}
        {!simple && (
          <Nav className="ml-auto">
            <Button
              className="settingsButton"
              variant="none"
              onClick={openSettingsModal}
            >
              settings
              <FiSliders className="ml-2" />
            </Button>
            <SettingsModal
              show={showSettingsModal}
              hideModal={() => setShowSettingsModal(false)}
            />
          </Nav>
        )}
      </Container>
    </ThemedHeader>
  );
}

const ThemedHeader = styled(Navbar)`
  height: ${({ theme }) => theme.headerHeight}px;
`;
