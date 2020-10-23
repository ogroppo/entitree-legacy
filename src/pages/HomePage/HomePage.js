import React, { useEffect, useContext, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import { useRouteMatch } from "react-router-dom";
import { AppContext } from "../../App";
import { GiFamilyTree } from "react-icons/gi";
import { Spinner } from "react-bootstrap";
import Header from "../../layout/Header/Header";
import { LANGS } from "../../constants/langs";
import { Helmet } from "react-helmet";
import { DEFAULT_DESC, SITE_NAME } from "../../constants/meta";
import usePageView from "../../lib/usePageView";
import "./HomePage.scss";

export default function HomePage() {
  usePageView();
  const {
    currentEntity,
    loadingEntity,
    setCurrentLang,
    currentProp,
  } = useContext(AppContext);

  const [loadedLang, setLoadedLang] = useState(false);

  const match = useRouteMatch();
  useEffect(() => {
    let { langCode } = match.params;
    let currentLangCode;
    if (langCode) {
      currentLangCode = langCode;
    } else {
      try {
        currentLangCode = localStorage.getItem("userLangCode");
      } catch (error) {
        //localstorage not working
      }
    }

    if (currentLangCode) {
      const currentLang = LANGS.find(({ code }) => code === currentLangCode);
      if (currentLang) setCurrentLang(currentLang);
    }
    setLoadedLang(true);
  }, []);

  if (!loadedLang) return null;

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
