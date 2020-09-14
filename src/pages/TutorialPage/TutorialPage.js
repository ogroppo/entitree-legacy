import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import Header from "../../layout/Header/Header";
import { Helmet } from "react-helmet";
import { DEFAULT_DESC, SITE_TITLE } from "../../constants/meta";

export default function AboutPage() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <div className="AboutPage">
      <Helmet>
        <title>Tutorial - {SITE_TITLE}</title>
        <meta name="description" content={DEFAULT_DESC} />
      </Helmet>
      <Header simple />
      <Container className="pb-5">
        <h1>{SITE_TITLE} Tutorial</h1>
        <p>
          Select a Person
          </p>
      </Container>
    </div>
  );
}
