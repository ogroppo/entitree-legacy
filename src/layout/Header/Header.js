import React, { useContext } from "react";
import {
  Navbar,
  Container,
  DropdownButton,
  Dropdown,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { GiTreeBranch } from "react-icons/gi";

import { EXAMPLES } from "../../constants/examples";
import { AppContext } from "../../App";
import "./Header.scss";
import { LANGS } from "../../constants/langs";

export default function Header() {
  const { lang, setLang } = useContext(AppContext);

  return (
    <Navbar className="Header" bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">
        <GiTreeBranch /> WikiForest
      </Navbar.Brand>
      <DropdownButton
        title="Examples"
        variant="info"
        className="examplesButton"
      >
        {EXAMPLES.map(({ name, href }) => (
          <Dropdown.Item key={name} href={href}>
            {name}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      <Nav className="ml-auto">
        <NavDropdown alignRight title={lang.name} className="langDropdown">
          {LANGS.map((lang) => (
            <NavDropdown.Item key={lang.code} onClick={() => setLang(lang)}>
              {lang.name}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Nav>
    </Navbar>
  );
}
