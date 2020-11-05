import React, { Component } from "react";
import { Alert, Container } from "react-bootstrap";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import "./App.scss";
import AboutPage from "./pages/AboutPage/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import Footer from "./layout/Footer/Footer";
import Logo from "./components/Logo/Logo";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import TutorialPage from "./pages/TutorialPage/TutorialPage";
import clsx from "clsx";
import ls from "local-storage";
import ReactGA from "react-ga";

const browserHistory = createBrowserHistory();

export const AppContext = React.createContext();

export default class App extends Component {
  state = {
    errors: [],
    infos: [],
    currentLang: null,
    secondLang: null,
    currentEntity: null,
    currentEntityId: null,
    currentProp: null,
    currentPropId: null,
    currentTheme: "default",
    settings: {
      showGenderColor: false,
      showEyeHairColors: false,
      showBirthName: false,
      showNavIcons: true,
      showExternalImages: false,
      showFace: false,
      imageType: "face",
    },
    loadingEntity: false,
    currentUpMap: null,
    setState: (state) => {
      this.setState({ ...state });
    },
    setCurrentUpMap: (currentUpMap) => {
      this.setState({ currentUpMap });
    },
    setCurrentPropId: (currentPropId) => {
      this.setState({ currentPropId });
    },
    setCurrentTheme: (currentTheme, isUser = true) => {
      if (isUser) {
        ReactGA.event({
          category: "Settings",
          action: `Updated`,
          label: `theme: ${currentTheme}`,
        });
        ls("storedTheme", currentTheme);
      }
      this.setState({ currentTheme });
    },
    setCurrentEntity: (currentEntity) => {
      this.setState({ currentEntity });
    },
    setCurrentEntityId: (currentEntityId) => {
      this.setState({ currentEntityId });
    },
    setCurrentProp: (currentProp) => {
      this.setState({ currentProp });
    },
    setLoadingEntity: (loadingEntity) => {
      this.setState({ loadingEntity });
    },
    setSettings: (settings) => {
      this.setState({ settings });
    },
    setSetting: (settingKey, settingValue) => {
      const settings = { ...this.state.settings, [settingKey]: settingValue };
      ReactGA.event({
        category: "Settings",
        action: `Updated`,
        label: `${settingKey}: ${settingValue}`,
      });
      ls("settings", settings);
      this.setState({
        settings,
      });
    },
    setCurrentLang: (currentLang) => {
      ReactGA.event({
        category: "Language",
        action: `Changed`,
        label: currentLang.code,
      });
      ls("storedLangCode", currentLang.code);
      this.setState({
        currentLang,
      });
    },
    setSecondLang: (secondLang) => {
      ReactGA.event({
        category: "Second Language",
        action: `Changed`,
        label: secondLang.code,
      });
      ls("storedSecondLangCode", secondLang.code);
      this.setState({ secondLang });
    },
    showError: (error) => {
      console.error(error);
      this.setState(({ errors }) => ({
        errors: errors.concat(error),
      }));
      setTimeout(() => {
        this.setState(({ errors }) => ({
          errors: errors.slice(1),
        }));
      }, 2500);
    },
    showInfo: ({ id, message }) => {
      this.setState(({ infos }) => ({
        infos: infos.concat({ id, message }),
      }));
      setTimeout(() => {
        this.setState(({ infos }) => ({
          infos: infos.slice(1),
        }));
      }, 2500);
    },
  };

  componentDidCatch = (error) => {
    this.state.showError(error);
  };

  render() {
    const { errors, infos, currentTheme } = this.state;
    return (
      <AppContext.Provider value={this.state}>
        <Router history={browserHistory}>
          <div className={clsx("App", currentTheme)}>
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
