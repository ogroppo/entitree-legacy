import React, { useContext, useEffect } from "react";
import { Form, Col, Row, InputGroup } from "react-bootstrap";
import { AppContext } from "../../App";
import useDebounce from "../../lib/useDebounce";

export default function CustomThemeForm() {
  const { customTheme, setCurrentTheme, setCustomThemeProp } = useContext(
    AppContext
  );

  const deboucedCustomTheme = useDebounce(customTheme, 400);
  useEffect(() => {
    setCurrentTheme(deboucedCustomTheme);
  }, [deboucedCustomTheme, setCurrentTheme]);

  return (
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
              onChange={(e) => setCustomThemeProp("nodeFlexDirection", "row")}
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
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("nodeHeight", +e.target.value)
              }
              type="number"
              value={customTheme.nodeHeight}
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
              value={customTheme.nodeWidth}
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
                value={customTheme.labelFontSize}
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
              checked={customTheme.datesDisplay === "block"}
              onChange={(e) => setCustomThemeProp("datesDisplay", "block")}
            />
            <Form.Check
              type="radio"
              label="hide"
              name="datesDisplay"
              id="datesDisplay-none"
              checked={customTheme.datesDisplay === "none"}
              onChange={(e) => setCustomThemeProp("datesDisplay", "none")}
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
              value={customTheme.datesFontSize}
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
          <InputGroup>
            <Form.Control
              onChange={(e) =>
                setCustomThemeProp("thumbHeight", +e.target.value)
              }
              type="number"
              value={customTheme.thumbHeight}
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
              value={customTheme.thumbWidth}
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

      <fieldset>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={3} className="pt-0">
            Separation
          </Form.Label>
          <Col sm={9}>
            <Form.Group controlId={"cousinsSeparation"}>
              <Form.Label>Cousins Separation Factor</Form.Label>
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
                  setCustomThemeProp("siblingSpouseSeparation", +e.target.value)
                }
                type="number"
                value={customTheme.siblingSpouseSeparation}
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
                  value={customTheme.nodeVerticalSpacing}
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
                value={customTheme.graphBackgroundColor}
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
                value={customTheme.nodeBackgroundColor}
              />
              <Form.Text className="text-muted">
                The background color for the card
              </Form.Text>
            </Form.Group>
          </Col>
        </Form.Group>
      </fieldset>
    </div>
  );
}
