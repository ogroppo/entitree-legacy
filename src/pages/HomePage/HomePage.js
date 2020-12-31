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
import styled from "styled-components";
import { useRouteMatch } from "react-router-dom";

export default function HomePageWrapper() {
  useLoadTheme();
  useCurrentLang();
  useLoadSettings();
  const { currentLang, currentTheme } = useContext(AppContext);

  if (!currentLang) return null;
  if (!currentTheme) return null;

  return (
    <ThemeProvider theme={currentTheme}>
      <HomePage />
    </ThemeProvider>
  );
}

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
      <ThemedMain>
        {loadingEntity && (
          <div className="graphPlaceholder">
            <div className="center">
              <Spinner animation="grow" />
              <div>Loading tree</div>
            </div>
          </div>
        )}
        {!itemSlug && (
          <div className="graphPlaceholder">
            <div className="center">
              <GiFamilyTree />
              <div>Start a new search or choose from the examples</div>
            </div>
          </div>
        )}
        {currentEntity && <Graph />}
      </ThemedMain>
      {!theme.isInIframe && <Footer />}
    </div>
  );
}

const ThemedMain = styled.main`
  height: ${({ theme }) =>
    theme.isInIframe
      ? `100vh`
      : `calc(100vh - ${theme.headerHeight}px - ${theme.searchBarHeight}px)`};
`;
