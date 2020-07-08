import React, { useContext, useState } from "react";
import { Form, Button, Dropdown, Modal, FormControl } from "react-bootstrap";
import { LANGS } from "../../constants/langs";
import { AppContext } from "../../App";
import "./Settings.scss";
import ReactGA from "react-ga";

export default function Settings({ show, hideModal }) {
  const {
    currentLang,
    setCurrentLang,
    showGenderColor,
    setShowGenderColor,
  } = useContext(AppContext);

  const setLang = (lang) => {
    ReactGA.event({
      category: "Language",
      action: `Changed`,
      label: lang.code,
    });

    try {
      localStorage.setItem("userLangCode", lang.code);
    } catch (error) {
      //localstorage not working
    }
    setCurrentLang(lang);
  };

  return (
    <Modal show={show} onHide={hideModal} className="Settings">
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId={"genderColors"}>
          <Form.Check
            custom
            checked={showGenderColor}
            onChange={(e) => setShowGenderColor(e.target.checked)}
            type="checkbox"
            label={"Use background color based on gender"}
          />
        </Form.Group>
        <Form.Group controlId="language">
          <Dropdown className="langDropdown">
            <Dropdown.Toggle as={CustomToggle}>
              <span className="langLabel">
                Translate labels where possible in
              </span>{" "}
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
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" className="mr-auto ml-0" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={hideModal}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
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

    const filterLangs = (e) => {
      const { value: inputValue } = e.target;
      setValue(inputValue.toLowerCase());
    };

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
            onChange={filterLangs}
            value={value}
            autoCapitalize="none"
            autoComplete="off"
          />
        </div>
        <ul className="list-unstyled langList">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);
