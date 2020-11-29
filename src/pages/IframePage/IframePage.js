import React from "react";
import { Container } from "react-bootstrap";
import { useRouteMatch } from "react-router-dom";

export default function IframePage() {
  const {
    params: { langCode, propSlug, itemSlug },
  } = useRouteMatch();
  return (
    <Container className="pt-3">
      <iframe
        width="700"
        height="700"
        src={`/${langCode}/${propSlug}/${itemSlug}`}
        //style={{ border: "none" }}
        title="Test iframe"
      ></iframe>
    </Container>
  );
}
