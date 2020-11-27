import "./HomePage.scss";
import { AppContext } from "../../App";
import { DEFAULT_DESC, SITE_NAME } from "../../constants/meta";
import { GiFamilyTree } from "react-icons/gi";
import { Helmet } from "react-helmet";
import { Spinner } from "react-bootstrap";
import { ThemeProvider } from "styled-components";
import Graph from "../../components/Graph/Graph";
import Header from "../../layout/Header/Header";
import React, { useContext } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import useCurrentLang from "../../hooks/useCurrentLang";
import useLoadEntity from "../../hooks/useLoadEntity";
import useLoadFromUrl from "../../hooks/useLoadFromUrl";
import useLoadSettings from "../../hooks/useLoadSettings";
import useLoadTheme from "../../hooks/useLoadTheme";
import usePageView from "../../lib/usePageView";
import useUpdateUrl from "../../hooks/useUpdateUrl";
import { useTheme } from "styled-components";
import Footer from "../../layout/Footer/Footer";
import ThemedGraphWrapper from "../../components/ThemedGraphWrapper";
import { useRouteMatch } from "react-router-dom";

function HomePage() {
  useLoadEntity();
  useLoadFromUrl();
  usePageView();
  useUpdateUrl();
  const { currentEntity, loadingEntity, currentProp } = useContext(AppContext);
  const theme = useTheme();

  const match = useRouteMatch();
  const { itemSlug } = match.params;

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
      {!theme.isInIframe && <Header />}
      {!theme.isInIframe && <SearchBar />}
      {loadingEntity && (
        <ThemedGraphWrapper className="graphPlaceholder">
          <div className="center">
            <Spinner animation="grow" />
            <div>Loading tree</div>
          </div>
        </ThemedGraphWrapper>
      )}
      {!itemSlug && (
        <ThemedGraphWrapper className="graphPlaceholder">
          <div className="center">
            <GiFamilyTree />
            <div>Start a new search or choose from the examples</div>
          </div>
        </ThemedGraphWrapper>
      )}
      {currentEntity && <Graph />}
      {!theme.isInIframe && <Footer />}
    </div>
  );
}

export default function HomePageWrapper() {
  useCurrentLang();
  useLoadSettings();
  useLoadTheme();
  const { currentLang, currentTheme } = useContext(AppContext);

  if (!currentLang) return null;
  if (!currentTheme) return null;

  return (
    <ThemeProvider theme={currentTheme}>
      <HomePage />
    </ThemeProvider>
  );
}
