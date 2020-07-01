import React, { useEffect } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import "./HomePage.scss";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

export default function HomePage() {
  const [currentEntity, setCurrentEntity] = React.useState(null);
  const [currentProp, setCurrentProp] = React.useState(null);

  const location = useLocation();
  useEffect(() => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, []);

  return (
    <div className="HomePage">
      <SearchBar
        setCurrentEntity={setCurrentEntity}
        setCurrentProp={setCurrentProp}
      />
      {currentEntity && (
        <Graph currentEntity={currentEntity} currentProp={currentProp} />
      )}
    </div>
  );
}
