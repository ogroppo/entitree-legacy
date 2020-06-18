import React from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import "./HomePage.scss";

export default function HomePage({ showError, showInfo }) {
  const [currentEntityId, setCurrentEntityId] = React.useState();
  const [currentPropId, setCurrentPropId] = React.useState();

  return (
    <div className="HomePage">
      <SearchBar
        setCurrentEntityId={setCurrentEntityId}
        setCurrentPropId={setCurrentPropId}
        showError={showError}
      />
      {currentEntityId && currentPropId && (
        <Graph
          showError={showError}
          currentEntityId={currentEntityId}
          currentPropId={currentPropId}
        />
      )}
    </div>
  );
}
