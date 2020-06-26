import React from "react";
import { Container } from "react-bootstrap";

export default function AboutPage() {
  return (
    <Container className="pt-3">
      <h1>About</h1>
      <h2>Humans</h2>
      <p>Orlando</p>
      <p>Martin</p>
      <h2>Bugs</h2>
      <p>
        <a className="btn btn-sm bg-info" target="_blank" rel="noopener noreferrer" href="https://github.com/ogroppo/wikiforest">
          <img alt="" className="img img-fluid" src="/icons/github.png" style={{maxHeight: 20 + "px"}} /> Wikiforest on Github
        </a>
        <br />
        Report</p>
    </Container>
  );
}
