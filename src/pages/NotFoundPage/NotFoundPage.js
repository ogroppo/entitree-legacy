import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import Header from "../../layout/Header/Header";
import "./NotFoundPage.scss";

export default function NotFoundPage() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <div className="NotFoundPage">
      <Header simple />
      <Container className="content pt-3">
        <h1>Page Not Found</h1>
      </Container>
    </div>
  );
}
