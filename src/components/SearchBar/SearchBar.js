import React, { useContext, useState, useRef, useEffect } from "react";
import useDebounce from "../../lib/useDebounce";
import "./SearchBar.scss";
import {
  Form,
  Spinner,
  Button,
  Dropdown,
  Container,
  InputGroup,
  Tooltip,
  Overlay,
} from "react-bootstrap";
import { AppContext } from "../../App";
import search from "../../wikidata/search";

export default function SearchBar() {
  const {
    currentLang,
    setCurrentPropId,
    currentProp,
    currentEntity,
    loadingEntity,
  } = useContext(AppContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState();
  const [fromKeyboard, setFromKeyboard] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      search(debouncedSearchTerm, currentLang.code).then(
        ({ search: searchResults }) => {
          searchResults = searchResults.filter(({ id, description }) => {
            //remove current entity from results
            if (currentEntity && id === currentEntity.id) {
              return false;
            }

            //remove wikimedia disam pages
            if (
              currentLang.disambPageDesc &&
              description === currentLang.disambPageDesc
            )
              return false;

            return true;
          });
          setLoadingSuggestions(false);
          setSearchResults(searchResults);
        }
      );
    } else {
      setLoadingSuggestions(false);
      setShowSuggestions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (currentEntity) {
      setFromKeyboard(false);
      setSearchTerm(currentEntity.label);
    }
  }, [currentEntity]);

  const propToggleRef = useRef();
  return (
    <Form
      className="SearchBar"
      onSubmit={(e) => {
        e.preventDefault();
        setShowSuggestions(true);
      }}
    >
      <Container>
        <Form.Group className="searchBox" controlId="searchBox">
          <InputGroup>
            <Form.Control
              onKeyDown={() => setFromKeyboard(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={loadingEntity ? "Loading entity..." : searchTerm}
              type="search"
              readOnly={loadingEntity}
              placeholder="Start typing to search..."
              autoComplete="off"
            />
            {currentEntity && (
              <InputGroup.Append>
                <Dropdown>
                  <Overlay
                    placement={"bottom"}
                    show={false}
                    target={propToggleRef.current}
                  >
                    <Tooltip>Select a property to show a tree</Tooltip>
                  </Overlay>
                  <Dropdown.Toggle
                    variant="none"
                    ref={propToggleRef}
                    id="dropdown-props"
                    className={
                      currentEntity &&
                      !currentProp &&
                      "shouldSelectProp btn-warning"
                    }
                  >
                    {currentProp
                      ? currentProp.overrideLabel || currentProp.label
                      : "Choose a property "}
                  </Dropdown.Toggle>

                  <Dropdown.Menu alignRight>
                    {currentEntity.availableProps.map((prop) => (
                      <Dropdown.Item
                        key={prop.id}
                        className={prop.isFav ? "fav" : ""}
                        onClick={() => setCurrentPropId(prop.id)}
                      >
                        {prop.overrideLabel || prop.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup.Append>
            )}
          </InputGroup>
          {showSuggestions && (
            <Suggestions
              loadingSuggestions={loadingSuggestions}
              searchResults={searchResults}
              setShowSuggestions={setShowSuggestions}
            />
          )}
        </Form.Group>
      </Container>
    </Form>
  );
}

function Suggestions({
  loadingSuggestions,
  searchResults,
  setShowSuggestions,
}) {
  const { setCurrentEntityId } = useContext(AppContext);
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
  }, [wrapperRef, setShowSuggestions]);

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
            setCurrentEntityId(result.id);
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
