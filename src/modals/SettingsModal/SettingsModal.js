import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Dropdown, Modal, FormControl } from "react-bootstrap";
import { LANGS, SECOND_LABELS } from "../../constants/langs";
import { THEMES } from "../../constants/themes";
import { AppContext } from "../../App";
import CustomThemeForm from "./CustomThemeForm";
import "./SettingsModal.scss";
import ReactGA from "react-ga";

export default function SettingsModal({ show, hideModal }) {
  const {
    currentLang,
    secondLabel,
    setSecondLabel,
    setCurrentLang,
    settings,
    setSetting,
    currentTheme,
    setCurrentTheme,
    customTheme,
  } = useContext(AppContext);

  useEffect(() => {
    ReactGA.event({
      category: "Settings",
      action: `User interaction`,
      label: "modal opened",
    });
  }, []);

  return (
    <Modal show={show} onHide={hideModal} className="SettingsModal">
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown className="themeDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Use Theme</span>
            &nbsp;&nbsp;
            {currentTheme.name}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.values(THEMES).map((theme, index) => (
              <Dropdown.Item
                key={theme.name}
                eventKey={index + 1}
                active={theme.name === currentTheme.name}
                disabled={theme.disabled}
                onClick={() =>
                  setCurrentTheme(theme.isCustom ? customTheme : theme)
                }
              >
                {theme.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        {currentTheme.isCustom && <CustomThemeForm />}
        <hr />
        <Dropdown className="langDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Translate labels where possible in</span>{" "}
            {currentLang.name}
          </Dropdown.Toggle>
          <Dropdown.Menu alignRight as={CustomMenu}>
            {LANGS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={lang.code === currentLang.code}
                onClick={() => setCurrentLang(lang)}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown className="langDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Add second label</span>{" "}
            {secondLabel ? secondLabel.name : <i>no</i>}
          </Dropdown.Toggle>
          <Dropdown.Menu alignRight as={CustomMenu}>
            <Dropdown.Item
              active={!secondLabel}
              onClick={() => setSecondLabel(null)}
            >
              - no second label -
            </Dropdown.Item>
            <Dropdown.Header>Properties</Dropdown.Header>

            {SECOND_LABELS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={secondLabel && lang.code === secondLabel.code}
                onClick={() => setSecondLabel(lang)}
                disabled={currentLang && currentLang.code === lang.code}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Header>Languages</Dropdown.Header>

            {LANGS.map((lang, index) => (
              <Dropdown.Item
                key={lang.code}
                eventKey={index + 1}
                active={secondLabel && lang.code === secondLabel.code}
                onClick={() => setSecondLabel(lang)}
                disabled={currentLang && currentLang.code === lang.code}
              >
                {lang.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <hr />
        <Form.Group controlId={"genderColors"}>
          <Form.Check
            custom
            checked={settings.showGenderColor}
            onChange={(e) => setSetting("showGenderColor", e.target.checked)}
            type="checkbox"
            label={"Use colors based on gender"}
          />
          <Form.Text className="text-muted pl-4">
            If browsing family trees, the nodes will have a background color
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={"eyeHairColors"}>
          <Form.Check
            custom
            checked={settings.showEyeHairColors}
            onChange={(e) => setSetting("showEyeHairColors", e.target.checked)}
            type="checkbox"
            label={"Show eye colors where possible"}
          />
          <Form.Text className="text-muted pl-4">
            An icon with the eye color of the person will appear
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={"birthName"}>
          <Form.Check
            custom
            checked={settings.showBirthName}
            onChange={(e) => setSetting("showBirthName", e.target.checked)}
            type="checkbox"
            label={"Show birth name instead of label"}
          />
          <Form.Text className="text-muted pl-4">
            Often people change their names during their life
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={"iconsDisplay"}>
          <Form.Check
            custom
            checked={settings.showNavIcons}
            onChange={(e) => setSetting("showNavIcons", e.target.checked)}
            type="checkbox"
            label={"Show navigation icons"}
          />
          <Form.Text className="text-muted pl-4">
            Toggle the icons next to the arrows
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={"showExternalImages"}>
          <Form.Check
            custom
            checked={settings.showExternalImages}
            onChange={(e) => setSetting("showExternalImages", e.target.checked)}
            type="checkbox"
            label={"Show external images"}
          />
          <Form.Text className="text-muted pl-4">
            Allow entitree to fetch images from other websites
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={"faceDisplay"}>
          <Form.Check
            custom
            checked={settings.showFace}
            className={"d-inline-block"}
            onChange={(e) => setSetting("showFace", e.target.checked)}
            type="checkbox"
            label={"Zoom in picture"}
          />
          {settings.showFace && (
            <Dropdown className="imageDropdown d-inline-block ml-1">
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
          )}
          <Form.Text className="text-muted pl-4">
            Try to zoom into the person's most relevant features
          </Form.Text>
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
              !value ||
              (child.props.children &&
                child.props.children.toLowerCase().startsWith(value))
          )}
        </ul>
      </div>
    );
  }
);
