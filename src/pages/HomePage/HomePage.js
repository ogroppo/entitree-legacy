import React, { useEffect, useContext } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import "./HomePage.scss";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { GiFamilyTree } from "react-icons/gi";

export default function HomePage() {
  const { currentEntity } = useContext(AppContext);

  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <div className="HomePage">
      <SearchBar />
      {currentEntity ? (
        <Graph />
      ) : (
        <div className="graphPlaceholder">
          <GiFamilyTree />
          <div>Start a new search or choose from the examples</div>
        </div>
      )}
    </div>
  );
}
