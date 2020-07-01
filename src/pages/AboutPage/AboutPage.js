import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

export default function AboutPage() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <Container className="pt-3">
      <h1>About</h1>
      <h2>Humans</h2>
      <p>Orlando</p>
      <p>Martin</p>
      <h2>Bugs</h2>
      <p>
        <a
          className="btn btn-sm bg-light"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/ogroppo/entitree/issues"
        >
          <img
            alt=""
            className="img img-fluid"
            src="/icons/github.png"
            style={{ maxHeight: 20 + "px" }}
          />{" "}
          Report a bug on Github
        </a>
      </p>
    </Container>
  );
}
