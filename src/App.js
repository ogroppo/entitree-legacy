import React, { Component } from "react";
import { Alert, Container } from "react-bootstrap";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import "./App.scss";
import qs from "query-string";

import AboutPage from "./pages/AboutPage/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import Footer from "./layout/Footer/Footer";
import { LANGS, DEFAULT_LANG } from "./constants/langs";
import Header from "./layout/Header/Header";
import Logo from "./components/Logo/Logo";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";

const browserHistory = createBrowserHistory();

export const AppContext = React.createContext();

export default class App extends Component {
  state = {
    errors: [],
    infos: [],
    currentLang: DEFAULT_LANG,
    hasLanguageChanged: 0,
    currentEntity: null,
    currentProp: null,
    showGenderColor: false,
    showBirthName: false,
    toggleIcons: false,
    loadingEntity: false,
  };

  componentDidMount() {}

  componentDidCatch = (error) => {
    this.showError(error);
  };

  setCurrentEntity = (currentEntity) => {
    this.setState({ currentEntity });
  };

  setCurrentProp = (currentProp) => {
    this.setState({ currentProp });
  };

  setLoadingEntity = (loadingEntity) => {
    this.setState({ loadingEntity });
  };

  setCurrentLang = (currentLang) => {
    this.setState({
      currentLang,
      hasLanguageChanged: this.state.hasLanguageChanged + 1,
    });
  };

  showError = (error) => {
    console.error(error);
    this.setState(({ errors }) => ({
      errors: errors.concat(error),
    }));
    setTimeout(() => {
      this.setState(({ errors }) => ({
        errors: errors.slice(1),
      }));
    }, 2500);
  };

  showInfo = ({ id, message }) => {
    this.setState(({ infos }) => ({
      infos: infos.concat({ id, message }),
    }));
    setTimeout(() => {
      this.setState(({ infos }) => ({
        infos: infos.slice(1),
      }));
    }, 2500);
  };

  setShowGenderColor = (showGenderColor) => {
    this.setState({ showGenderColor });
  };
  setShowBirthName = (showBirthName) => {
    this.setState({ showBirthName });
  };
  setToggleIcons = (toggleIcons) => {
    this.setState({ toggleIcons });
  };
  render() {
    const {
      showError,
      showInfo,
      setCurrentLang,
      setCurrentProp,
      setCurrentEntity,
      setShowGenderColor,
      setShowBirthName,
      setToggleIcons,
      setLoadingEntity,
    } = this;
    const {
      currentLang,
      errors,
      infos,
      currentEntity,
      currentProp,
      hasLanguageChanged,
      showGenderColor,
      showBirthName,
      toggleIcons,
      loadingEntity,
    } = this.state;
    return (
      <AppContext.Provider
        value={{
          showError,
          showInfo,
          setCurrentLang,
          setCurrentProp,
          setCurrentEntity,
          setShowGenderColor,
          setShowBirthName,
          setToggleIcons,
          setLoadingEntity,
          currentLang,
          currentProp,
          currentEntity,
          hasLanguageChanged,
          showGenderColor,
          showBirthName,
          toggleIcons,
          loadingEntity,
        }}
      >
        <Router history={browserHistory}>
          <div className="App">
            <div className="appBody">
              <div className="messages">
                {errors.map((error, index) => (
                  <Alert key={JSON.stringify(error) + index} variant="danger">
                    {error.message}
                  </Alert>
                ))}
                {infos.map(({ id, message }) => (
                  <Alert key={id || message} variant="info">
                    {message}
                  </Alert>
                ))}
              </div>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/:langCode/:propSlug/:itemSlug">
                  <HomePage />
                </Route>
                <Route exact path="/about">
                  <AboutPage />
                </Route>
                <Route exact path="/tutorial">
                  <TutorialPage />
                </Route>
                <Route exact path="/privacy">
                  <PrivacyPolicyPage />
                </Route>
                <Route exact path="/logopreview">
                  <Container className="pt-5">
                    <Logo width={"5em"} height={"5em"} />
                  </Container>
                </Route>
                <Route component={NotFoundPage} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </AppContext.Provider>
    );
  }
}
