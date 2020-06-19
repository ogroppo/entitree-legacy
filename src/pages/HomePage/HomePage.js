import React from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import "./HomePage.scss";

export default function HomePage() {
  const [currentEntityId, setCurrentEntityId] = React.useState();
  const [currentPropId, setCurrentPropId] = React.useState();

  return (
    <div className="HomePage">
      <SearchBar
        setCurrentEntityId={setCurrentEntityId}
        setCurrentPropId={setCurrentPropId}
      />
      {currentEntityId && currentPropId && (
        <Graph
          currentEntityId={currentEntityId}
          currentPropId={currentPropId}
        />
      )}
    </div>
  );
}
