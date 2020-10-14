import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  CardGroup,
  CardColumns,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import Header from "../../layout/Header/Header";
import { Helmet } from "react-helmet";
import { DEFAULT_DESC, SITE_NAME } from "../../constants/meta";

export default function AboutPage() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <div className="AboutPage">
      <Helmet>
        <title>Tutorial - {SITE_NAME}</title>
        <meta name="description" content={DEFAULT_DESC} />
      </Helmet>
      <Header simple />
      <Container className="pb-5">
        <h1>{SITE_NAME} Tutorial</h1>
        <p>
          On the main page you can search for any kind of Object, it may be a
          person, taxon, concept, literally anything.
        </p>
        <Card style={{ width: "100%" }}>
          <Card.Img variant="top" src="/examples/screenshot_queen.png" />
          <Card.Body>
            <Card.Title>Queen's family</Card.Title>
            <Card.Text>Parent's at the top, children below.</Card.Text>
            <a
              className="btn btn-primary"
              href={"/en/family_tree/Elizabeth_II"}
            >
              Open this tree
            </a>
          </Card.Body>
        </Card>
        <CardColumns>
          <Card>
            <Card.Img variant="top" src="/examples/screenshot_bretzel.png" />
            <Card.Body>
              <Card.Title>Types of bread rolls</Card.Title>
              <Card.Text></Card.Text>
              <a className="btn btn-primary" href={"/en/subclass_of/Lye_roll"}>
                Open this tree
              </a>
            </Card.Body>
          </Card>
          <Card style={{ width: "200%" }}>
            <Card.Img
              variant="top"
              src="/examples/screenshot_named_after_coca.png"
            />
            <Card.Body>
              <Card.Title>Coca cola's etymology</Card.Title>
              <Card.Text>
                On top, what is named after coca cola, below: What was coca-cola
                named after.
              </Card.Text>
              <a className="btn btn-primary" href={"/en/named_after/Coca-Cola"}>
                Open this tree
              </a>
            </Card.Body>
          </Card>
        </CardColumns>
      </Container>
    </div>
  );
}
