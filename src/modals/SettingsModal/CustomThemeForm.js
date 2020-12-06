import React, { useContext, useEffect } from "react";
import { Form, Col, Row, InputGroup } from "react-bootstrap";
import { AppContext } from "../../App";
import useDebounce from "../../lib/useDebounce";
import Button from "react-bootstrap/Button";

export default function CustomThemeForm() {
  const {
    currentCustomTheme,
    setCurrentTheme,
    resetCurrentTheme,
    setCustomThemeProp,
  } = useContext(AppContext);

  const deboucedCustomTheme = useDebounce(currentCustomTheme, 1000);
  useEffect(() => {
    setCurrentTheme(deboucedCustomTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deboucedCustomTheme]);

  return (
    <div className="currentCustomTheme mt-2">
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
              checked={currentCustomTheme.nodeFlexDirection === "row"}
              onChange={(e) => setCustomThemeProp("nodeFlexDirection", "row")}
            />
            <Form.Check
              type="radio"
              label="vertical"
              name="nodeFlexDirection"
              id="nodeFlexDirection-vertical"
              checked={currentCustomTheme.nodeFlexDirection === "column"}
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
              value={currentCustomTheme.nodeHeight}
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
              value={currentCustomTheme.nodeWidth}
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
              value={currentCustomTheme.nodeBorder}
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
              value={currentCustomTheme.nodeBorderRadius}
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
              value={currentCustomTheme.nodeBoxShadow}
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
              value={currentCustomTheme.nodeFocusedBoxShadow}
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
                value={currentCustomTheme.contentPaddingTop}
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
                value={currentCustomTheme.contentPaddingLeft}
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
                value={currentCustomTheme.labelFontSize}
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
              checked={currentCustomTheme.descriptionDisplay === "inline"}
              onChange={(e) =>
                setCustomThemeProp("descriptionDisplay", "inline")
              }
            />
            <Form.Check
              type="radio"
              label="hide"
              name="descriptionDisplay"
              id="descriptionDisplay-none"
              checked={currentCustomTheme.descriptionDisplay === "none"}
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
              checked={currentCustomTheme.datesDisplay === "block"}
              onChange={(e) => setCustomThemeProp("datesDisplay", "block")}
            />
            <Form.Check
              type="radio"
              label="hide"
              name="datesDisplay"
              id="datesDisplay-none"
              checked={currentCustomTheme.datesDisplay === "none"}
              onChange={(e) => setCustomThemeProp("datesDisplay", "none")}
            />
          </Col>
        </Form.Group>
      </fieldset>

      <Form.Group controlId={"datesYearOnly"}>
        <Col sm={{ span: 9, offset: 3 }} className="pl-0">
          <Form.Check
            custom
            checked={currentCustomTheme.datesYearOnly}
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
              value={currentCustomTheme.datesFontSize}
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
              checked={currentCustomTheme.thumbCounterDisplay === "block"}
              onChange={(e) =>
                setCustomThemeProp("thumbCounterDisplay", "block")
              }
            />
            <Form.Check
              type="radio"
              label="hide"
              name="thumbCounterDisplay"
              id="thumbCounterDisplay-hide"
              checked={currentCustomTheme.thumbCounterDisplay === "none"}
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
              value={currentCustomTheme.thumbHeight}
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
              value={currentCustomTheme.thumbWidth}
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
              value={currentCustomTheme.thumbBorderRadius}
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
                value={currentCustomTheme.separationCousins}
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
                value={currentCustomTheme.separationSameGroup}
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
                value={currentCustomTheme.separationSiblingSpouse}
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
                  value={currentCustomTheme.nodeVerticalSpacing}
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
                value={currentCustomTheme.graphBackgroundColor}
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
                value={currentCustomTheme.nodeBackgroundColor}
              />
              <Form.Text className="text-muted">
                The background color for the card
              </Form.Text>
            </Form.Group>
            <Form.Group controlId={"labelFontColor"}>
              <Form.Label>Font color</Form.Label>
              <InputGroup>
                <Form.Control
                  onChange={(e) =>
                    setCustomThemeProp("labelFontColor", e.target.value)
                  }
                  type="text"
                  value={currentCustomTheme.labelFontColor}
                />
              </InputGroup>
              <Form.Text className="text-muted">
                The color of the text of the item
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
                value={currentCustomTheme.relStroke}
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
                value={currentCustomTheme.relStrokeWidth}
              />
              <Form.Text className="text-muted">
                The thickness of the line that forms the relationship
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            More
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId={"nodeCss"}>
              <Form.Label>Additional CSS code</Form.Label>
              <Form.Control
                onChange={(e) => setCustomThemeProp("nodeCss", e.target.value)}
                as="textarea"
                rows={3}
                value={currentCustomTheme.nodeCss}
              />
              <Form.Text className="text-muted">
                Additional CSS for which will be used for the Node element,
                (expert mode); use your Browser's inspector to see the class
                names of the elements you want to change.
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
      <Form.Group as={Row}>
        <Col sm={{ span: 9, offset: 3 }}>
          <Button size="sm" onClick={resetCurrentTheme}>
            Reset values
          </Button>
        </Col>
      </Form.Group>
    </div>
  );
}
