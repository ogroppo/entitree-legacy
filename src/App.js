import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import "./App.scss";
import AboutPage from "./pages/AboutPage/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage/PrivacyPolicyPage";
import Footer from "./layout/Footer/Footer";
import { LANGS, DEFAULT_LANG } from "./constants/langs";
import Header from "./layout/Header/Header";
const browserHistory = createBrowserHistory();

export const AppContext = React.createContext();

export default class App extends Component {
  state = {
    errors: [],
    infos: [],
    currentLang: DEFAULT_LANG,
  };

  componentDidMount() {
    const userLangCode = localStorage.getItem("userLangCode");
    if (userLangCode) {
      const lang = LANGS.find(({ code }) => code === userLangCode);
      if (lang) this.setCurrentLang(lang);
    }
  }

  componentDidCatch = (error) => {
    this.showError(error);
  };

  setCurrentLang = (currentLang) => {
    this.setState({ currentLang });
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

  render() {
    const { showError, showInfo, setCurrentLang } = this;
    const { currentLang, errors, infos } = this.state;
    return (
      <AppContext.Provider
        value={{ showError, showInfo, currentLang, setCurrentLang }}
      >
        <Router history={browserHistory}>
          <div className="App">
            <div className="appBody">
              <Header />
              <div className="messages">
                {errors.map((error) => (
                  <Alert key={JSON.stringify(error)} variant="danger">
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
                <Route exact path="/about">
                  <AboutPage />
                </Route>
                <Route exact path="/privacy">
                  <PrivacyPolicyPage />
                </Route>
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </AppContext.Provider>
    );
  }
}
