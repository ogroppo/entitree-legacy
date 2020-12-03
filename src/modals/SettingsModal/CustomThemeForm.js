import React, { useContext, useEffect } from "react";
import { Form, Col, Row, InputGroup } from "react-bootstrap";
import { AppContext } from "../../App";
import useDebounce from "../../lib/useDebounce";
import Button from "react-bootstrap/Button";

export default function CustomThemeForm() {
  const {
    currentTheme,
    setCurrentTheme,
    resetCurrentTheme,
    setCustomThemeProp,
  } = useContext(AppContext);

  const deboucedCustomTheme = useDebounce(currentTheme, 400);
  useEffect(() => {
    setCurrentTheme(deboucedCustomTheme);
  }, [deboucedCustomTheme, setCurrentTheme]);

  return (
    <div className="currentTheme mt-2">
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Reset
          </Form.Label>
          <Button onClick={resetCurrentTheme}>Reset this theme</Button>
        </Form.Group>
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
              checked={currentTheme.nodeFlexDirection === "row"}
              onChange={(e) => setCustomThemeProp("nodeFlexDirection", "row")}
            />
            <Form.Check
              type="radio"
              label="vertical"
              name="nodeFlexDirection"
              id="nodeFlexDirection-vertical"
              checked={currentTheme.nodeFlexDirection === "column"}
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
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("nodeHeight", +e.target.value)
              }
              type="number"
              value={currentTheme.nodeHeight}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed Height for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"nodeWidth"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Width</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomThemeProp("nodeWidth", +e.target.value)}
              type="number"
              value={currentTheme.nodeWidth}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed width for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"nodeBorder"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Border</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) => setCustomThemeProp("nodeBorder", e.target.value)}
              type="text"
              value={currentTheme.nodeBorder}
            />
            <InputGroup.Append>
              <InputGroup.Text>CSS</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed width for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"nodeBorderRadius"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Border Radius</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("nodeBorderRadius", +e.target.value)
              }
              type="number"
              value={currentTheme.nodeBorderRadius}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            The fixed width for all cards
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"nodeBoxShadow"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Node Box Shadow</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("nodeBoxShadow", e.target.value)
              }
              type="text"
              value={currentTheme.nodeBoxShadow}
            />
            <InputGroup.Append>
              <InputGroup.Text>CSS</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            Style for box-shadow property
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"nodeFocusedBoxShadow"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Focused Node Box Shadow</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("nodeFocusedBoxShadow", e.target.value)
              }
              type="text"
              value={currentTheme.nodeFocusedBoxShadow}
            />
            <InputGroup.Append>
              <InputGroup.Text>CSS</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            Focused style for box-shadow property
          </Form.Text>
        </Col>
      </Form.Group>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Text
          </Form.Label>
          <Col sm={9}>
            <Form.Label>Text Padding Top</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("contentPaddingTop", +e.target.value)
                }
                type="number"
                value={currentTheme.contentPaddingTop}
              />
              <InputGroup.Append>
                <InputGroup.Text>px</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">
              The padding from the top line of the image (e.g. horizontal
              layout)
            </Form.Text>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId={"contentPaddingLeft"}>
          <Col sm={{ span: 9, offset: 3 }}>
            <Form.Label>Text Padding Left</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("contentPaddingLeft", e.target.value)
                }
                type="number"
                value={currentTheme.contentPaddingLeft}
              />
              <InputGroup.Append>
                <InputGroup.Text>px</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <Form.Text className="text-muted">
              The padding from the right end of the image (e.g. horizontal
              layout)
            </Form.Text>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Label
          </Form.Label>
          <Col sm={9}>
            <Form.Label>Font size</Form.Label>
            <InputGroup>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("labelFontSize", +e.target.value)
                }
                type="number"
                value={currentTheme.labelFontSize}
              />
              <InputGroup.Append>
                <InputGroup.Text>px</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
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
              checked={currentTheme.descriptionDisplay === "inline"}
              onChange={(e) =>
                setCustomThemeProp("descriptionDisplay", "inline")
              }
            />
            <Form.Check
              type="radio"
              label="hide"
              name="descriptionDisplay"
              id="descriptionDisplay-none"
              checked={currentTheme.descriptionDisplay === "none"}
              onChange={(e) => setCustomThemeProp("descriptionDisplay", "none")}
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
              checked={currentTheme.datesDisplay === "block"}
              onChange={(e) => setCustomThemeProp("datesDisplay", "block")}
            />
            <Form.Check
              type="radio"
              label="hide"
              name="datesDisplay"
              id="datesDisplay-none"
              checked={currentTheme.datesDisplay === "none"}
              onChange={(e) => setCustomThemeProp("datesDisplay", "none")}
            />
          </Col>
        </Form.Group>
      </fieldset>

      <Form.Group controlId={"datesYearOnly"}>
        <Col sm={{ span: 9, offset: 3 }} className="pl-0">
          <Form.Check
            custom
            checked={currentTheme.datesYearOnly}
            onChange={(e) =>
              setCustomThemeProp("datesYearOnly", e.target.checked)
            }
            type="checkbox"
            label={"Show only year of dates"}
          />
          <Form.Text className="text-muted pl-4">
            e.g. show 1968 instead of 26 May 1968
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"datesFontSize"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Date Font size</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("datesFontSize", +e.target.value)
              }
              type="number"
              value={currentTheme.datesFontSize}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
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
              checked={currentTheme.thumbCounterDisplay === "block"}
              onChange={(e) =>
                setCustomThemeProp("thumbCounterDisplay", "block")
              }
            />
            <Form.Check
              type="radio"
              label="hide"
              name="thumbCounterDisplay"
              id="thumbCounterDisplay-hide"
              checked={currentTheme.thumbCounterDisplay === "none"}
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
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("thumbHeight", +e.target.value)
              }
              type="number"
              value={currentTheme.thumbHeight}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            e.g. The fixed height of the image in the Person's card
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"thumbWidth"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Thumbnail Width</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("thumbWidth", +e.target.value)
              }
              type="number"
              value={currentTheme.thumbWidth}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            e.g. The fixed width of the image in the Person's card
          </Form.Text>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId={"thumbBorderRadius"}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Form.Label>Thumbnail Border Radius</Form.Label>
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("thumbBorderRadius", +e.target.value)
              }
              type="number"
              value={currentTheme.thumbBorderRadius}
            />
            <InputGroup.Append>
              <InputGroup.Text>px</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <Form.Text className="text-muted">
            e.g. The rouded corners of the person's image
          </Form.Text>
        </Col>
      </Form.Group>

      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Separation
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId={"separationCousins"}>
              <Form.Label>Cousins Separation Factor</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("separationCousins", +e.target.value)
                }
                type="number"
                value={currentTheme.separationCousins}
              />
              <Form.Text className="text-muted">
                The gap between the cousins
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={"separationSameGroup"}>
              <Form.Label>Same Group Separation</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("separationSameGroup", +e.target.value)
                }
                type="number"
                value={currentTheme.separationSameGroup}
              />
              <Form.Text className="text-muted">
                The gap between the siblings
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={"separationSiblingSpouse"}>
              <Form.Label>Sibling/Spouse Separation</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("separationSiblingSpouse", +e.target.value)
                }
                type="number"
                value={currentTheme.separationSiblingSpouse}
              />
              <Form.Text className="text-muted">
                The gap between the sibling and the spouse of a person
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={"nodeVerticalSpacing"}>
              <Form.Label>Node Vertical Spacing</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("nodeVerticalSpacing", +e.target.value)
                  }
                  type="number"
                  value={currentTheme.nodeVerticalSpacing}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Form.Text className="text-muted">
                e.g. The vertical space between parents and children
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Colors
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId={"graphBackgroundColor"}>
              <Form.Label>Graph Background</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("graphBackgroundColor", e.target.value)
                }
                type="text"
                value={currentTheme.graphBackgroundColor}
              />
              <Form.Text className="text-muted">
                The background color for the whole graph
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={"nodeBackgroundColor"}>
              <Form.Label>Node Background</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("nodeBackgroundColor", e.target.value)
                }
                type="text"
                value={currentTheme.nodeBackgroundColor}
              />
              <Form.Text className="text-muted">
                The background color for the card
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Relationship
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId={"relStroke"}>
              <Form.Label>Stroke Color</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("relStroke", e.target.value)
                }
                type="text"
                value={currentTheme.relStroke}
              />
              <Form.Text className="text-muted">
                The color of the line that forms the relationship
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={"relStrokeWidth"}>
              <Form.Label>Stroke Width</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setCustomThemeProp("relStrokeWidth", e.target.value)
                }
                type="text"
                value={currentTheme.relStrokeWidth}
              />
              <Form.Text className="text-muted">
                The thickness of the line that forms the relationship
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
    </div>
  );
}
