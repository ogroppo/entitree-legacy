import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

export default function PrivacyPolicyPage() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <Container className="pt-3">
      <h1>Privacy Policy</h1>
      <p>Todo</p>
    </Container>
  );
}
