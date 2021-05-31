import "./SettingsModal.scss";

import {
  Button,
  Collapse,
  Dropdown,
  Form,
  FormControl,
  Modal,
} from "react-bootstrap";
import { LANGS, SECOND_LABELS } from "../../constants/langs";
import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "../../App";
import CustomThemeForm from "./CustomThemeForm";
import {
  EXTRA_INFO_OPTIONS,
  RIGHT_ENTITY_OPTIONS,
} from "../../constants/properties";
import ReactGA from "react-ga";
import { STORED_CUSTOM_THEME_PREFIX_KEY } from "../../constants/storage";
import { THEMES } from "../../constants/themes";
import ls from "local-storage";

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
    setCustomTheme,
  } = useContext(AppContext);

  useEffect(() => {
    ReactGA.event({
      category: "Settings",
      action: `User interaction`,
      label: "modal opened",
    });
  }, []);

  const [open, setOpen] = useState(false);

  const changeTheme = (theme) => {
    const storedCustomTheme = ls(STORED_CUSTOM_THEME_PREFIX_KEY + theme.name);
    setCustomTheme(storedCustomTheme || theme);
    setCurrentTheme(storedCustomTheme || theme);
  };

  return (
    <Modal
      show={show}
      onHide={hideModal}
      dialogClassName="SettingsModalDialog"
      className="SettingsModal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Dropdown className="themeDropdown">
          <div>
            <Dropdown.Toggle as={CustomToggle} className="float-left">
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
                  onClick={() => changeTheme(theme)}
                >
                  {theme.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
            <Button
              variant="link"
              className="float-right"
              onClick={(e) => setOpen(!open)}
              aria-controls="collapse-custom-theme-form"
              aria-expanded={open}
            >
              <i>customize</i>
            </Button>
          </div>
          <Form.Text className="text-muted mt-0">
            Give the tree the style you prefer, useful for custom styling
          </Form.Text>
        </Dropdown>
        <Collapse in={open} mountOnEnter={true}>
          <div id="collapse-custom-theme-form">
            <CustomThemeForm />
          </div>
        </Collapse>
        <hr />
        <Dropdown className="langDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Translate label to</span> {currentLang.name}
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
          <Form.Text className="text-muted mt-0">
            If the language is available, the label (e.g. the person's name)
            will be translated
          </Form.Text>
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
          <Form.Text className="text-muted mt-0">
            If the property or language is available, a second label will be
            shown, useful when people are known by different names
          </Form.Text>
        </Dropdown>
        <Dropdown className="spousesDropdown">
          <Dropdown.Toggle as={CustomToggle}>
            <span className="label">Show on the right</span>{" "}
            {settings.rightEntityOption.propIds ? (
              settings.rightEntityOption.title
            ) : (
              <i>{settings.rightEntityOption.title}</i>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {RIGHT_ENTITY_OPTIONS.map((rightEntityOption, index) => (
              <Dropdown.Item
                key={index}
                active={
                  JSON.stringify(settings.rightEntityOption.propIds) ===
                  JSON.stringify(rightEntityOption.propIds)
                }
                onClick={() =>
                  setSetting("rightEntityOption", rightEntityOption)
                }
              >
                {rightEntityOption.title}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
          <Form.Text className="text-muted mt-0">
            Decide what to show on the right of each person, this applies only
            to humans and fictional characters.
          </Form.Text>
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
            (blue for men, red for women)
          </Form.Text>
        </Form.Group>
        <Form.Group controlId={"extraInfo"}>
          <Form.Check
            custom
            className={"d-inline-block"}
            checked={settings.showExtraInfo}
            onChange={(e) => setSetting("showExtraInfo", e.target.checked)}
            type="checkbox"
            label={"Show extra info"}
          />
          <Dropdown className="imageDropdown d-inline-block ml-1">
            <Dropdown.Toggle as={CustomToggle}>
              <span className="imageDropdownLabel">show</span>{" "}
              {
                EXTRA_INFO_OPTIONS.find((c) => c.code === settings.extraInfo)
                  .title
              }
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={settings.extraInfo === "eyeColor"}
                onClick={() => setSetting("extraInfo", "eyeColor")}
              >
                Eye color
              </Dropdown.Item>
              <Dropdown.Item
                active={settings.extraInfo === "hairColor"}
                onClick={() => setSetting("extraInfo", "hairColor")}
              >
                Hair color
              </Dropdown.Item>
              <Dropdown.Item
                active={settings.extraInfo === "countryFlag"}
                onClick={() => setSetting("extraInfo", "countryFlag")}
              >
                Country flag
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Form.Text className="text-muted pl-4">
            An icon with extra info icon, ie. Countryflag of a person's
            birthplace or citizenship (beta)
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
            checked={settings.hideToggleButton}
            onChange={(e) => setSetting("hideToggleButton", e.target.checked)}
            type="checkbox"
            label={"Hide expand/collapse buttons"}
          />
          <Form.Text className="text-muted pl-4">
            If this option is selected, it's not possible to navigate the tree
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
