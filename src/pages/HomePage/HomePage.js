import React, { useEffect, useContext } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import "./HomePage.scss";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { GiFamilyTree } from "react-icons/gi";
import { Spinner } from "react-bootstrap";

export default function HomePage() {
  const { currentEntity, loadingEntity } = useContext(AppContext);

  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <div className="HomePage">
      <SearchBar />
      {loadingEntity && (
        <div className="graphPlaceholder">
          <div className="center">
            <Spinner animation="grow" />
            <div>Loading tree</div>
          </div>
        </div>
      )}
      {!loadingEntity && !currentEntity && (
        <div className="graphPlaceholder">
          <div className="center">
            <GiFamilyTree />
            <div>Start a new search or choose from the examples</div>
          </div>
        </div>
      )}
      {currentEntity && <Graph />}
    </div>
  );
}
