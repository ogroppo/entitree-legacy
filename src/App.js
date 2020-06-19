import React from "react";
import { Alert } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import "./App.scss";
import AboutPage from "./pages/AboutPage/AboutPage";
import Footer from "./layout/Footer/Footer";
import { LANGS } from "./constants/langs";
import Header from "./layout/Header/Header";
const browserHistory = createBrowserHistory();

export const AppContext = React.createContext();

export default function App() {
  const [errors, setErrors] = React.useState([]);
  const [infos, setInfos] = React.useState([]);
  const [lang, setLang] = React.useState(LANGS[0]);

  React.useEffect(() => {
    const userLangCode = localStorage.getItem("userLangCode");
    if (userLangCode) {
      const lang = LANGS.find(({ code }) => code === userLangCode);
      if (lang) setLang(lang);
    }
  }, []);

  React.useEffect(() => {
    console.log("here");
    localStorage.setItem("userLangCode", lang.code);
  }, [lang.code]);

  const showError = (error) => {
    console.error(error);
    setErrors((errors) => errors.concat(error));
    setTimeout(() => {
      setErrors(errors.slice(1));
    }, 2500);
  };

  const showInfo = ({ id, message }) => {
    setInfos((infos) => infos.concat({ id, message }));
    setTimeout(() => {
      setInfos(infos.slice(1));
    }, 2500);
  };

  return (
    <AppContext.Provider value={{ showError, showInfo, lang, setLang }}>
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
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </AppContext.Provider>
  );
}
