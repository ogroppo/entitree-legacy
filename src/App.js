import React, { Component } from "react";
import { Alert, Container } from "react-bootstrap";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import "./App.scss";
import AboutPage from "./pages/AboutPage/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import Footer from "./layout/Footer/Footer";
import { DEFAULT_LANG } from "./constants/langs";
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
    showNavIcons: true,
    showFace: false,
    loadingEntity: false,
    imageType: "face",
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

  setImageType = (imageType) => {
    this.setState({
      imageType,
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
  setShowNavIcons = (showNavIcons) => {
    this.setState({ showNavIcons });
  };
  setShowFace = (showFace) => {
    this.setState({ showFace });
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
      setShowNavIcons,
      setShowFace,
      setLoadingEntity,
      setImageType,
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
      showNavIcons,
      showFace,
      imageType,
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
          setShowFace,
          setShowNavIcons,
          setImageType,
          setLoadingEntity,
          currentLang,
          currentProp,
          currentEntity,
          hasLanguageChanged,
          showGenderColor,
          showBirthName,
          showNavIcons,
          showFace,
          imageType,
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
