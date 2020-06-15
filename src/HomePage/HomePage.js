import React from "react";
import {
  Form,
  Spinner,
  Button,
  Dropdown,
  Row,
  Col,
  Container,
  Alert,
} from "react-bootstrap";
import { search, getItem, getItemProps } from "../lib/api";
import useDebounce from "../lib/useDebouce";
import "./HomePage.scss";
import Graph from "../components/Graph/Graph";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";

export default function HomePage({ showError, showInfo }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchId, setSearchId] = React.useState();
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState();
  const [fromKeyboard, setFromKeyboard] = React.useState(true);
  const [availableProps, setAvailableProps] = React.useState([]);
  const [prop, setProp] = React.useState({});
  const [showGraph, setShowGraph] = React.useState();
  const [hasSubmitted, setHasSubmitted] = React.useState();
  const [currentEntityId, setCurrentEntityId] = React.useState();
  const [currentPropId, setCurrentPropId] = React.useState();

  let history = useHistory();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      search(debouncedSearchTerm).then(({ data: { search } }) => {
        setLoadingSuggestions(false);
        setSearchResults(search);
      });
    } else {
      setLoadingSuggestions(false);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    if (searchId) {
      getItemProps(searchId).then((props) => {
        setAvailableProps(props);
      });
    }
  }, [searchId]);

  let location = useLocation();
  React.useEffect(() => {
    let { q, p } = qs.parse(location.search);
    let qPromise;
    let pPromise;
    if (q) {
      //showInfo({ message: "Loading entity" });
      qPromise = getItem(q)
        .then((entity) => {
          setFromKeyboard(false);
          setSearchTerm(entity.labels.en.value);
          setSearchId(entity.id);
        })
        .catch((e) => showError(e));
    }
    if (p) {
      //showInfo({ message: "Loading property" });
      pPromise = getItem(p)
        .then((entity) => {
          setProp({
            id: entity.id,
            label: entity.labels.en.value,
          });
        })
        .catch((e) => showError(e));
    }
    if (p && q) {
      setHasSubmitted(true);
    }
  }, []);

  React.useEffect(() => {
    if (hasSubmitted && prop.id && searchId) {
      setCurrentEntityId(searchId);
      setCurrentPropId(prop.id);
      setHasSubmitted(false);
      setShowGraph(true);
    }
  }, [hasSubmitted, prop.id, searchId]);

  const onSubmit = (e) => {
    e.preventDefault();
    const query = { q: searchId, p: prop.id };
    const searchString = qs.stringify(query);
    history.push({
      search: "?" + searchString,
    });
    setHasSubmitted(true);
  };

  return (
    <div className="HomePage">
      <Form onSubmit={onSubmit}>
        <Container>
          <Row className="pt-4">
            <Col>
              <Form.Group className="searchBox" controlId="searchBox">
                <Form.Control
                  onKeyPress={() => setFromKeyboard(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  value={searchTerm}
                  type="search"
                  placeholder="Start typing"
                  autoComplete="off"
                />
                {showSuggestions && (
                  <Suggestions
                    setFromKeyboard={setFromKeyboard}
                    setSearchTerm={setSearchTerm}
                    setShowSuggestions={setShowSuggestions}
                    setSearchId={setSearchId}
                    loadingSuggestions={loadingSuggestions}
                    searchResults={searchResults}
                  />
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="props">
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!availableProps.length}
                    variant="none"
                    id="dropdown-props"
                  >
                    {prop.label ? prop.label : "Choose a property"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {availableProps.map((prop) => (
                      <Dropdown.Item
                        key={prop.id}
                        onClick={() => setProp(prop)}
                      >
                        {prop.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Col>
            <Col sm={1}>
              <Button disabled={!searchId || !prop} type="submit">
                GO!
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
      {showGraph && (
        <Graph
          showError={showError}
          currentEntityId={currentEntityId}
          currentPropId={currentPropId}
        />
      )}
    </div>
  );
}

function Suggestions({
  loadingSuggestions,
  searchResults,
  setSearchTerm,
  setSearchId,
  setShowSuggestions,
  setFromKeyboard,
}) {
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="Suggestions dropdown-menu show d-relative">
      {loadingSuggestions && (
        <div className="searchingMessage">
          <Spinner animation="border" variant="secondary" /> Searching
        </div>
      )}
      {!loadingSuggestions && !searchResults.length && (
        <div className="searchingMessage">Sorry, no results found</div>
      )}
      {searchResults.map((result) => (
        <Button
          key={result.id}
          className="searchResultBtn"
          variant="light"
          onClick={() => {
            setFromKeyboard(false);
            setSearchTerm(result.label);
            setSearchId(result.id);
            setShowSuggestions(false);
          }}
        >
          <b>{result.label}</b>
          {result.description && <i>{result.description}</i>}
        </Button>
      ))}
    </div>
  );
}
