import React from "react";
import { Container } from "react-bootstrap";
import Header from "../../layout/Header/Header";
import "./NotFoundPage.scss";
import usePageView from "../../lib/usePageView";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  usePageView();

  return (
    <div className="NotFoundPage">
      <Header simple />
      <Container className="content pt-3">
        <h1>Page Not Found</h1>
        <Link to={"/"}>Go back to the home page</Link>
      </Container>
    </div>
  );
}
