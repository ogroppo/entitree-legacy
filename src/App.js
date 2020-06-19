import React from "react";
import {
  Navbar,
  Container,
  Alert,
  DropdownButton,
  Dropdown,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import { GiTreeBranch } from "react-icons/gi";
import "./App.scss";
import { EXAMPLES } from "./constants/examples";
import AboutPage from "./pages/AboutPage/AboutPage";
import Footer from "./layout/Footer/Footer";
import { LANGS } from "./constants/langs";
const browserHistory = createBrowserHistory();

export const AppContext = React.createContext();

export default function App() {
  const [errors, setErrors] = React.useState([]);
  const [infos, setInfos] = React.useState([]);
  const [lang, setLang] = React.useState("en");
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
            <Navbar bg="dark" variant="dark" expand="lg">
              <Container>
                <Navbar.Brand href="/">
                  <GiTreeBranch /> WikiForest
                </Navbar.Brand>
                <DropdownButton
                  title="Examples"
                  variant="info"
                  className="examplesButton"
                >
                  {EXAMPLES.map(({ name, href }) => (
                    <Dropdown.Item key={name} href={href}>
                      {name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <div className="ml-auto">
                  <Navbar.Toggle aria-controls="navbar-nav" />
                  <Navbar.Collapse id="navbar-nav">
                    <Nav>
                      <Navbar.Text>Language:</Navbar.Text>
                      <NavDropdown title={lang} id="lang-drop">
                        {LANGS.map((lang) => (
                          <NavDropdown.Item
                            key={lang.code}
                            onClick={() => setLang(lang.code)}
                          >
                            {lang.code}
                          </NavDropdown.Item>
                        ))}
                      </NavDropdown>
                    </Nav>
                  </Navbar.Collapse>
                </div>
              </Container>
            </Navbar>
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
