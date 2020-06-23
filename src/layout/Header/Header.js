import React, { useContext, useState } from "react";
import {
  Navbar,
  Container,
  DropdownButton,
  Dropdown,
  Nav,
  FormControl,
} from "react-bootstrap";
import { GiTreeBranch } from "react-icons/gi";

import { EXAMPLES } from "../../constants/examples";
import { AppContext } from "../../App";
import "./Header.scss";
import { LANGS } from "../../constants/langs";

export default function Header() {
  const { currentLang, setCurrentLang } = useContext(AppContext);

  const setLang = (lang) => {
    localStorage.setItem("userLangCode", lang.code);
    setCurrentLang(lang);
  };

  return (
    <Navbar className="Header" bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <GiTreeBranch /> WikiForest
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
          <Dropdown className="langDropdown">
            <Dropdown.Toggle as={CustomToggle}>
              {currentLang.name}
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight as={CustomMenu}>
              {LANGS.map((lang, index) => (
                <Dropdown.Item
                  key={lang.code}
                  eventKey={index + 1}
                  active={lang.code === currentLang.code}
                  onClick={() => setLang(lang)}
                >
                  {lang.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    aria-haspopup="true"
    ref={ref}
    role="button"
    className="dropdown-toggle nav-link"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <div className="filterWrapper">
          <FormControl
            autoFocus
            className=""
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);
