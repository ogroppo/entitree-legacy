import "./App.scss";

import { Alert, Container } from "react-bootstrap";
import React, { Component } from "react";
import { Route, Router, Switch } from "react-router-dom";
import {
  STORED_CUSTOM_THEME_PREFIX_KEY,
  STORED_LANG_CODE_KEY,
  STORED_SECOND_LANG_CODE_KEY,
  STORED_SETTINGS_KEY,
  STORED_THEME_KEY,
} from "./constants/storage";

import AboutPage from "./pages/AboutPage/AboutPage";
import HomePage from "./pages/HomePage/HomePage";
import IframePage from "./pages/IframePage/IframePage";
import Logo from "./components/Logo/Logo";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import { RIGHT_ENTITY_OPTIONS } from "./constants/properties";
import ReactGA from "react-ga";
import { THEMES } from "./constants/themes";
import TutorialPage from "./pages/TutorialPage/TutorialPage";
import { createBrowserHistory } from "history";
import ls from "local-storage";
import treeLayout from "./lib/getTreeLayout";

export const browserHistory = createBrowserHistory();

export const AppContext = React.createContext();

export default class App extends Component {
  state = {
    errors: [],
    infos: [],
    currentLang: null,
    secondLabel: null,
    currentEntity: null,
    currentEntityId: null,
    currentProp: null,
    currentPropId: null,
    currentCustomTheme: null,
    currentTheme: null,
    settings: {
      showGenderColor: false,
      showExtraInfo: false,
      extraInfo: "eyeColor",
      showBirthName: false,
      hideToggleButton: false,
      showExternalImages: false,
      showFace: false,
      rightEntityOption: RIGHT_ENTITY_OPTIONS[1],
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
    setCurrentTheme: (theme, isUser = true) => {
      if (isUser) {
        ReactGA.event({
          category: "Settings",
          action: `Updated`,
          label: `theme: ${theme.name}`,
        });
        ls(STORED_THEME_KEY, theme.name);
      }
      treeLayout.nodeSize([
        theme.nodeWidth,
        theme.nodeHeight + theme.nodeVerticalSpacing,
      ]);
      treeLayout.separation((next, prev) => {
        if (next.isSpouse) return theme.separationSiblingSpouse;
        if (prev.isSpouse && !next.isSpouse) return theme.separationCousins;

        if (prev.isSibling) return theme.separationSiblingSpouse;
        if (next.isSibling && !prev.isSibling) return theme.separationCousins;

        if (next.parent === prev.parent) return theme.separationSameGroup;

        if (next.parent !== prev.parent) return theme.separationCousins;
      });

      this.setState({
        currentTheme: theme,
      });
    },
    setCurrentEntityId: (currentEntityId) => {
      this.setState({ currentEntityId });
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
      ls(STORED_SETTINGS_KEY, settings);
      this.setState({
        settings,
      });
    },
    setCustomTheme: (currentCustomTheme) => {
      this.setState({
        currentCustomTheme,
      });
    },
    resetCurrentTheme: () => {
      const resetTheme = THEMES.find(
        ({ name }) => this.state.currentTheme.name === name
      );
      ls.remove(STORED_CUSTOM_THEME_PREFIX_KEY + this.state.currentTheme.name);
      this.state.setCurrentTheme(resetTheme, false);
      this.setState({
        currentCustomTheme: resetTheme,
      });
    },
    setCustomThemeProp: (themeKey, themeValue) => {
      const currentCustomTheme = {
        ...(this.state.currentCustomTheme ||
          THEMES.find(({ name }) => this.state.currentTheme.name === name)),
        [themeKey]: themeValue,
      };
      ls(
        STORED_CUSTOM_THEME_PREFIX_KEY + this.state.currentTheme.name,
        currentCustomTheme
      );
      this.setState({
        currentCustomTheme,
      });
    },
    setCurrentLang: (currentLang) => {
      ReactGA.event({
        category: "Language",
        action: `Changed`,
        label: currentLang.code,
      });
      ls(STORED_LANG_CODE_KEY, currentLang.code);
      this.setState({
        currentLang,
      });
    },
    setSecondLabel: (secondLabel) => {
      if (secondLabel) {
        ReactGA.event({
          category: "Second Label",
          action: `Changed`,
          label: secondLabel.code,
        });
        ls(STORED_SECOND_LANG_CODE_KEY, secondLabel.code);
      } else {
        ls.remove(STORED_SECOND_LANG_CODE_KEY);
      }
      this.setState({ secondLabel });
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
    const { errors, infos } = this.state;
    return (
      <AppContext.Provider value={this.state}>
        <Router history={browserHistory}>
          <div className="App">
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
              <Route path="/iframe/:langCode/:propSlug/:itemSlug">
                <IframePage />
              </Route>
              <Route exact path="/logopreview">
                <Container className="pt-5">
                  <Logo width={"5em"} height={"5em"} />
                </Container>
              </Route>
              <Route component={NotFoundPage} />
            </Switch>
          </div>
        </Router>
      </AppContext.Provider>
    );
  }
}
