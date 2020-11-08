import React, { useContext } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import { AppContext } from "../../App";
import { GiFamilyTree } from "react-icons/gi";
import { Spinner } from "react-bootstrap";
import Header from "../../layout/Header/Header";
import { Helmet } from "react-helmet";
import { DEFAULT_DESC, SITE_NAME } from "../../constants/meta";
import usePageView from "../../lib/usePageView";
import "./HomePage.scss";
import useLoadFromUrl from "../../hooks/useLoadFromUrl";
import useCurrentLang from "../../hooks/useCurrentLang";
import useSettings from "../../hooks/useSettings";
import useUpdateUrl from "../../hooks/useUpdateUrl";
import useLoadEntity from "../../hooks/useLoadEntity";

function HomePage() {
  usePageView();
  useUpdateUrl();
  useLoadFromUrl();
  useLoadEntity();
  const { currentEntity, loadingEntity, currentProp } = useContext(AppContext);

  return (
    <div className="HomePage">
      {currentEntity ? (
        <Helmet>
          <title>
            {currentEntity.label}
            {currentProp
              ? ` - ${currentProp.overrideLabel || currentProp.label}`
              : ""}{" "}
            - {SITE_NAME}
          </title>
          {currentEntity.description && (
            <meta name="description" content={currentEntity.description} />
          )}
        </Helmet>
      ) : (
        <Helmet>
          <meta name="description" content={DEFAULT_DESC} />
        </Helmet>
      )}
      <Header />
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

export default function HomePageWrapper() {
  useCurrentLang();
  useSettings();
  const { currentLang } = useContext(AppContext);

  if (!currentLang) return null;

  return <HomePage />;
}
