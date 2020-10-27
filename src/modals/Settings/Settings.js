import React, { useContext, useState } from "react";
import {
  Form,
  Button,
  Dropdown,
  Modal,
  FormControl,
  Col,
} from "react-bootstrap";
import { LANGS } from "../../constants/langs";
import { THEMES } from "../../constants/themes";
import { AppContext } from "../../App";
import "./Settings.scss";
import ReactGA from "react-ga";

export default function Settings({ show, hideModal }) {
  const {
    currentLang,
    secondLang,
    setSecondLang,
    setCurrentLang,
    settings,
    showFace,
    setShowFace,
    imageType,
    setSetting,
    setImageType,
    currentTheme,
    setCurrentTheme,
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
            checked={settings.showGenderColor}
            onChange={(e) => setSetting("showGenderColor", e.target.checked)}
            type="checkbox"
            label={"Use background color based on gender"}
          />
        </Form.Group>
        <Form.Group controlId={"eyeHairColors"}>
          <Form.Check
            custom
            checked={settings.showEyeHairColors}
            onChange={(e) => setSetting("showEyeHairColors", e.target.checked)}
            type="checkbox"
            label={"Add icons with eye and hair color (lacks data)"}
          />
        </Form.Group>
        <Form.Group controlId={"birthName"}>
          <Form.Check
            custom
            checked={settings.showBirthName}
            onChange={(e) => setSetting("showBirthName", e.target.checked)}
            type="checkbox"
            label={"Show birth name instead of label"}
          />
        </Form.Group>
        <Form.Group controlId={"iconsDisplay"}>
          <Form.Check
            custom
            checked={settings.showNavIcons}
            onChange={(e) => setSetting("showNavIcons", e.target.checked)}
            type="checkbox"
            label={"Show navigation icons"}
          />
        </Form.Group>
        <Form.Group controlId={"showExternalImages"}>
          <Form.Check
            custom
            checked={settings.showExternalImages}
            onChange={(e) => setSetting("showExternalImages", e.target.checked)}
            type="checkbox"
            label={"Show external images"}
          />
        </Form.Group>
        <Form.Row>
          <Col xs="auto">
            <Form.Group controlId={"faceDisplay"}>
              <Form.Check
                custom
                checked={settings.showFace}
                onChange={(e) => setSetting("showFace", e.target.checked)}
                type="checkbox"
                label={"Zoom in picture"}
              />
            </Form.Group>
          </Col>
          {settings.showFace && (
            <Col xs="auto">
              <Dropdown className="imageDropdown">
                <Dropdown.Toggle as={CustomToggle}>
                  <span className="imageDropdownLabel">show</span>{" "}
                  {settings.imageType}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    active={settings.imageType === "head"}
                    onClick={() => setSetting("imageType", "head")}
                  >
                    Head
                  </Dropdown.Item>
                  <Dropdown.Item
                    active={settings.imageType === "face"}
                    onClick={() => setSetting("imageType", "face")}
                  >
                    Face
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          )}
        </Form.Row>
        <div>
          {currentLang && (
            <Dropdown className="langDropdown">
              <Dropdown.Toggle as={CustomToggle}>
                <span className="label">
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
          )}
        </div>

        <Form.Group controlId="language">
          <Dropdown className="langDropdown">
            <Dropdown.Toggle as={CustomToggle}>
              <span className="label">Add second language for labels</span>{" "}
              {secondLang ? secondLang.name : <i>no</i>}
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight as={CustomMenu}>
              <Dropdown.Item
                active={!secondLang}
                onClick={() => setSecondLang(null)}
              >
                - no second language -
              </Dropdown.Item>
              {LANGS.map((lang, index) => (
                <Dropdown.Item
                  key={lang.code}
                  eventKey={index + 1}
                  active={secondLang && lang.code === secondLang.code}
                  onClick={() => setSecondLang(lang)}
                  disabled={currentLang && currentLang.code === lang.code}
                >
                  {lang.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        <hr />
        <div>
          <Dropdown className="themeDropdown">
            <Dropdown.Toggle as={CustomToggle}>
              <span className="label">Choose theme</span> {currentTheme}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {THEMES.map((theme, index) => (
                <Dropdown.Item
                  key={theme}
                  eventKey={index + 1}
                  active={theme === currentTheme}
                  onClick={() => setCurrentTheme(theme)}
                >
                  {theme}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
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
  <Button
    variant="link"
    aria-haspopup="true"
    ref={ref}
    className="dropdown-toggle nav-link"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </Button>
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
        <ul className="list-unstyled list">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);
