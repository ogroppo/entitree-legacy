import React from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import "./HomePage.scss";

export default function HomePage() {
  const [currentEntity, setCurrentEntity] = React.useState();
  const [currentProp, setCurrentProp] = React.useState();

  return (
    <div className="HomePage">
      <SearchBar
        setCurrentEntity={setCurrentEntity}
        setCurrentProp={setCurrentProp}
      />
      {currentEntity && currentProp && (
        <Graph currentEntity={currentEntity} currentProp={currentProp} />
      )}
    </div>
  );
}
