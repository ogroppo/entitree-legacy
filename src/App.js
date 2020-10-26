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
    showGenderColor: false,
    showEyeHairColors: false,
    showBirthName: false,
    showNavIcons: true,
    showFace: false,
    loadingEntity: false,
    imageType: "face",
    currentTheme: "default",
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
    setShowGenderColor: (showGenderColor) => {
      this.setState({ showGenderColor });
    },
    setCurrentTheme: (currentTheme) => {
      this.setState({ currentTheme });
    },
    setShowEyeHairColors: (showEyeHairColors) => {
      this.setState({ showEyeHairColors });
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
    setCurrentLang: (currentLang) => {
      this.setState({
        currentLang,
      });
    },
    setSecondLang: (secondLang) => {
      try {
        localStorage.setItem("userSecondLangCode", secondLang.code);
      } catch (error) {
        //localstorage not working
      }
      this.setState({ secondLang });
    },
    setImageType: (imageType) => {
      this.setState({
        imageType,
      });
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
    setShowBirthName: (showBirthName) => {
      this.setState({ showBirthName });
    },
    setShowNavIcons: (showNavIcons) => {
      this.setState({ showNavIcons });
    },
    setShowFace: (showFace) => {
      this.setState({ showFace });
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
