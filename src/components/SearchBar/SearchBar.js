import React from "react";
import useDebounce from "../../lib/useDebounce";
import "./SearchBar.scss";
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
import { search, getItem, getItemTypes, getItemProps } from "../../lib/api";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { preferredProps } from "../../config/preferredProps";

export default function SearchBar({
  setCurrentEntityId,
  setCurrentPropId,
  showError,
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [entityId, setEntityId] = React.useState();
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState();
  const [fromKeyboard, setFromKeyboard] = React.useState(true);
  const [availableProps, setAvailableProps] = React.useState([]);
  const [prop, setProp] = React.useState({});

  //Check on mount if there are params in the url
  let location = useLocation();
  React.useEffect(() => {
    (async () => {
      try {
        let { q, p } = qs.parse(location.search);
        if (q) {
          //showInfo({ message: "Loading entity" });
          const entity = getItem(q);
          setFromKeyboard(false);
          setSearchTerm(entity.labels.en.value);
          setEntityId(entity.id);
        }
        if (p) {
          //showInfo({ message: "Loading property" });
          const entity = getItem(p);
          setProp({
            id: entity.id,
            label: entity.labels.en.value,
          });
        }
        if (p && q) {
          showGraph();
        }
      } catch (error) {
        showError(error);
      }
    })();
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  React.useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      search(debouncedSearchTerm).then(({ data: { search } }) => {
        setLoadingSuggestions(false);
        setSearchResults(search);
        console.log(search);
      });
    } else {
      setLoadingSuggestions(false);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  //Get new props on entity change
  React.useEffect(() => {
    if (entityId) {
      (async () => {
        const types = await getItemTypes(entityId);

        let props = [];
        types.forEach((type) => {
          if (preferredProps[type.id])
            props = props.concat(preferredProps[type.id]);
        });
        if (!props.length) props = await getItemProps(entityId);

        setAvailableProps(props);
      })();
    }
  }, [entityId]);

  const history = useHistory();
  const onSubmit = (e) => {
    e.preventDefault();
    const query = { q: entityId, p: prop.id };
    const searchString = qs.stringify(query);
    history.push({
      search: "?" + searchString,
    });
    showGraph();
  };

  const showGraph = () => {
    setCurrentEntityId(entityId);
    setCurrentPropId(prop.id);
  };

  return (
    <Form className="SearchBar" onSubmit={onSubmit}>
      <Container>
        <Row className="pt-4">
          <Col md={6} lg={5}>
            <Form.Group className="searchBox" controlId="searchBox">
              <Form.Control
                onKeyPress={() => setFromKeyboard(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                value={searchTerm}
                type="search"
                placeholder="Start typing to search..."
                autoComplete="off"
              />
              {showSuggestions && (
                <Suggestions
                  setFromKeyboard={setFromKeyboard}
                  setSearchTerm={setSearchTerm}
                  setShowSuggestions={setShowSuggestions}
                  setEntityId={setEntityId}
                  loadingSuggestions={loadingSuggestions}
                  searchResults={searchResults}
                />
              )}
            </Form.Group>
          </Col>
          <Col md={6} lg={4}>
            <Form.Group controlId="props">
              <Dropdown>
                <Dropdown.Toggle
                  disabled={!availableProps.length}
                  variant="none"
                  id="dropdown-props"
                >
                  {prop.label ? prop.label : "Choose Tree type"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {availableProps.map((prop) => (
                    <Dropdown.Item key={prop.id} onClick={() => setProp(prop)}>
                      {prop.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
          <Col md={12} lg={3}>
            <Button
              className="submitButton"
              disabled={!entityId || !prop.id}
              type="submit"
            >
              SHOW TREE
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

function Suggestions({
  loadingSuggestions,
  searchResults,
  setSearchTerm,
  setEntityId,
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
            setEntityId(result.id);
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
