import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Button,
  Dropdown,
  Modal,
  FormControl,
  Col,
  Row,
} from "react-bootstrap";
import { LANGS } from "../../constants/langs";
import { THEMES } from "../../constants/themes";
import { AppContext } from "../../App";
import "./Settings.scss";
import ReactGA from "react-ga";
import useDebounce from "../../lib/useDebounce";

export default function Settings({ show, hideModal }) {
  const {
    currentLang,
    secondLang,
    setSecondLang,
    setCurrentLang,
    settings,
    setSetting,
    currentTheme,
    customTheme,
    setCurrentTheme,
    setCustomThemeProp,
  } = useContext(AppContext);

  useEffect(() => {
    ReactGA.event({
      category: "Settings",
      action: `User interaction`,
      label: "modal opened",
    });
  }, []);

  const deboucedCustomTheme = useDebounce(customTheme, 400);
  useEffect(() => {
    setCurrentTheme(deboucedCustomTheme);
  }, [deboucedCustomTheme, setCurrentTheme]);

  return (
    <Modal show={show} onHide={hideModal} className="Settings">
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Dropdown className="themeDropdown">
            <Dropdown.Toggle as={CustomToggle}>
              <span className="label">Choose theme</span> {currentTheme.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.values(THEMES).map((theme, index) => (
                <Dropdown.Item
                  key={theme.name}
                  eventKey={index + 1}
                  active={theme.name === currentTheme.name}
                  disabled={theme.disabled}
                  onClick={() => setCurrentTheme(theme)}
                >
                  {theme.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {currentTheme.isCustom && (
            <div className="customTheme mt-2">
              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={3} className="pt-0">
                    Node Layout
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Check
                      type="radio"
                      label="horizontal"
                      name="nodeFlexDirection"
                      id="nodeFlexDirection-horizontal"
                      checked={customTheme.nodeFlexDirection === "row"}
                      onChange={(e) =>
                        setCustomThemeProp("nodeFlexDirection", "row")
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="vertical"
                      name="nodeFlexDirection"
                      id="nodeFlexDirection-vertical"
                      checked={customTheme.nodeFlexDirection === "column"}
                      onChange={(e) =>
                        setCustomThemeProp("nodeFlexDirection", "column")
                      }
                    />
                  </Col>
                </Form.Group>
              </fieldset>
              <Form.Group as={Row} controlId={"nodeHeight"}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Form.Label>Node Height</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setCustomThemeProp("nodeHeight", +e.target.value)
                    }
                    type="number"
                    value={customTheme.nodeHeight}
                  />
                  <Form.Text className="text-muted">
                    The fixed Height for all cards
                  </Form.Text>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId={"nodeWidth"}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Form.Label>Node Width</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setCustomThemeProp("nodeWidth", +e.target.value)
                    }
                    type="number"
                    value={customTheme.nodeWidth}
                  />
                  <Form.Text className="text-muted">
                    The fixed width for all cards
                  </Form.Text>
                </Col>
              </Form.Group>
              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={3} className="pt-0">
                    Label
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Label>Font size</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setCustomThemeProp("labelFontSize", +e.target.value)
                      }
                      type="number"
                      value={customTheme.labelFontSize}
                    />
                    <Form.Text className="text-muted">
                      The cards label e.g. the person's name
                    </Form.Text>
                  </Col>
                </Form.Group>
              </fieldset>
              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={3} className="pt-0">
                    Description
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Check
                      type="radio"
                      label="show"
                      name="descriptionDisplay"
                      id="descriptionDisplay-inline"
                      checked={customTheme.descriptionDisplay === "inline"}
                      onChange={(e) =>
                        setCustomThemeProp("descriptionDisplay", "inline")
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="hide"
                      name="descriptionDisplay"
                      id="descriptionDisplay-none"
                      checked={customTheme.descriptionDisplay === "none"}
                      onChange={(e) =>
                        setCustomThemeProp("descriptionDisplay", "none")
                      }
                    />
                  </Col>
                </Form.Group>
              </fieldset>
              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={3} className="pt-0">
                    Dates
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Check
                      type="radio"
                      label="show"
                      name="datesDisplay"
                      id="datesDisplay-block"
                      checked={customTheme.datesDisplay === "block"}
                      onChange={(e) =>
                        setCustomThemeProp("datesDisplay", "block")
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="hide"
                      name="datesDisplay"
                      id="datesDisplay-none"
                      checked={customTheme.datesDisplay === "none"}
                      onChange={(e) =>
                        setCustomThemeProp("datesDisplay", "none")
                      }
                    />
                  </Col>
                </Form.Group>
              </fieldset>

              <Form.Group controlId={"datesYearOnly"}>
                <Col sm={{ span: 9, offset: 3 }} className="pl-0">
                  <Form.Check
                    custom
                    checked={customTheme.datesYearOnly}
                    onChange={(e) =>
                      setCustomThemeProp("datesYearOnly", e.target.checked)
                    }
                    type="checkbox"
                    label={"Show only year of dates"}
                  />
                  <small className="text-muted pl-4">
                    e.g. show 1968 instead of 26 May 1968
                  </small>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId={"datesFontSize"}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Form.Label>Date Font size</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setCustomThemeProp("datesFontSize", +e.target.value)
                    }
                    type="number"
                    value={customTheme.datesFontSize}
                  />
                  <Form.Text className="text-muted">
                    The dates at the bottom of the card
                  </Form.Text>
                </Col>
              </Form.Group>

              <fieldset>
                <Form.Group as={Row}>
                  <Form.Label as="legend" column sm={3} className="pt-0">
                    Thumbnail Counter
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Check
                      type="radio"
                      label="show"
                      name="thumbCounterDisplay"
                      id="thumbCounterDisplay-show"
                      checked={customTheme.thumbCounterDisplay === "block"}
                      onChange={(e) =>
                        setCustomThemeProp("thumbCounterDisplay", "block")
                      }
                    />
                    <Form.Check
                      type="radio"
                      label="hide"
                      name="thumbCounterDisplay"
                      id="thumbCounterDisplay-hide"
                      checked={customTheme.thumbCounterDisplay === "none"}
                      onChange={(e) =>
                        setCustomThemeProp("thumbCounterDisplay", "none")
                      }
                    />
                  </Col>
                </Form.Group>
              </fieldset>
              <Form.Group as={Row} controlId={"thumbHeight"}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Form.Label>Thumbnail Height</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setCustomThemeProp("thumbHeight", +e.target.value)
                    }
                    type="number"
                    value={customTheme.thumbHeight}
                  />
                  <Form.Text className="text-muted">
                    e.g. The fixed height of the image in the Person's card
                  </Form.Text>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId={"thumbWidth"}>
                <Col sm={{ span: 9, offset: 3 }}>
                  <Form.Label>Thumbnail Width</Form.Label>
                  <Form.Control
                    onChange={(e) =>
                      setCustomThemeProp("thumbWidth", +e.target.value)
                    }
                    type="number"
                    value={customTheme.thumbWidth}
                  />
                  <Form.Text className="text-muted">
                    e.g. The fixed width of the image in the Person's card
                  </Form.Text>
                </Col>
              </Form.Group>

              <Form.Group controlId={"cousinsSeparation"}>
                <Form.Label>Cousins Separation</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("cousinsSeparation", +e.target.value)
                  }
                  type="number"
                  value={customTheme.cousinsSeparation}
                />
                <Form.Text className="text-muted">
                  The gap between the cousins
                </Form.Text>
              </Form.Group>
              <Form.Group controlId={"sameGroupSeparation"}>
                <Form.Label>Same Group Separation</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("sameGroupSeparation", +e.target.value)
                  }
                  type="number"
                  value={customTheme.sameGroupSeparation}
                />
                <Form.Text className="text-muted">
                  The gap between the siblings
                </Form.Text>
              </Form.Group>
              <Form.Group controlId={"siblingSpouseSeparation"}>
                <Form.Label>Sibling/Spouse Separation</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp(
                      "siblingSpouseSeparation",
                      +e.target.value
                    )
                  }
                  type="number"
                  value={customTheme.siblingSpouseSeparation}
                />
                <Form.Text className="text-muted">
                  The gap between the sibling and the spouse of a person
                </Form.Text>
              </Form.Group>
              <Form.Group controlId={"graphBackgroundColor"}>
                <Form.Label>Graph Background Color</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("graphBackgroundColor", e.target.value)
                  }
                  type="text"
                  value={customTheme.graphBackgroundColor}
                />
                <Form.Text className="text-muted">
                  The background color for the whole graph
                </Form.Text>
              </Form.Group>
              <Form.Group controlId={"nodebackgroundColor"}>
                <Form.Label>Node Background Color</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("nodebackgroundColor", e.target.value)
                  }
                  type="text"
                  value={customTheme.nodebackgroundColor}
                />
                <Form.Text className="text-muted">
                  The background color for the card
                </Form.Text>
              </Form.Group>

              <Form.Group controlId={"nodeVerticalSpacing"}>
                <Form.Label>Node Vertical Spacing</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("nodeVerticalSpacing", +e.target.value)
                  }
                  type="number"
                  value={customTheme.nodeVerticalSpacing}
                />
                <Form.Text className="text-muted">
                  e.g. The vertical space between parents and children
                </Form.Text>
              </Form.Group>
            </div>
          )}
        </div>
        <hr />
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
            label={"Show eye colors (lacks data)"}
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
                    onClick={() => setCurrentLang(lang)}
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
