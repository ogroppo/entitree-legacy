import React from "react";
import { Navbar, Container, Alert } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from "./pages/HomePage/HomePage";
import { GiTreeBranch } from "react-icons/gi";
import "./App.scss";
const browserHistory = createBrowserHistory();

function App() {
  const [errors, setErrors] = React.useState([]);
  const [infos, setInfos] = React.useState([]);
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
    <Router history={browserHistory}>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">
              <GiTreeBranch /> WikiForest
            </Navbar.Brand>
            <div className="ml-auto">
              <Navbar.Toggle aria-controls="navbar-nav" />
              <Navbar.Collapse id="navbar-nav"></Navbar.Collapse>
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
            <HomePage showError={showError} showInfo={showInfo} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
