import React, { useContext, useState, useRef } from "react";
import useDebounce from "../../lib/useDebounce";
import "./SearchBar.scss";
import {
  Form,
  Spinner,
  Button,
  Dropdown,
  Container,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Overlay,
} from "react-bootstrap";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { FAMILY_PROP, FAMILY_IDS_MAP } from "../../constants/properties";
import { AppContext } from "../../App";
import { FaStar } from "react-icons/fa";
import getItem from "../../wikidata/getItem";
import getItemProps from "../../wikidata/getItemProps";
import search from "../../wikidata/search";
import { DEFAULT_LANG } from "../../constants/langs";

export default function SearchBar() {
  const {
    currentLang,
    showError,
    hasLanguageChanged,
    setCurrentEntity,
    setCurrentProp,
    currentProp,
    currentEntity,
    setLoadingEntity,
    loadingEntity,
  } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loadingProps, setLoadingProps] = React.useState(false);
  const [loadingProp, setLoadingProp] = React.useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState();
  const [fromKeyboard, setFromKeyboard] = React.useState(true);
  const [availableProps, setAvailableProps] = React.useState([]);

  //Check on mount if there are params in the url
  const location = useLocation();
  React.useEffect(() => {
    (async () => {
      try {
        let { q, p } = qs.parse(location.search);
        loadEntity(q, p);
      } catch (error) {
        showError(error);
      }
    })();
  }, []);

  //reload entity on lang change
  React.useEffect(() => {
    if (hasLanguageChanged) {
      (async () => {
        try {
          if (currentEntity)
            await loadEntity(
              currentEntity.id,
              currentProp ? currentProp.id : null
            );
        } catch (error) {
          showError(error);
        }
      })();
    }
  }, [hasLanguageChanged]);

  const loadEntity = async (_currentEntitId, _currentPropId) => {
    try {
      if (_currentEntitId) {
        if (currentEntity && _currentEntitId !== currentEntity.id)
          setCurrentEntity(null); //avoids weird caching behaviour, get a fresh one

        setFromKeyboard(false);
        setLoadingEntity(true);
        setLoadingProps(true);
        let calls = [
          getItem(_currentEntitId, currentLang.code),
          getItemProps(_currentEntitId, currentLang.code),
        ];
        if (_currentPropId) {
          calls.push(getItem(_currentPropId, currentLang.code));
        }
        let [_currentEntity, itemProps, _currentProp] = await Promise.all(
          calls
        );

        //currentProp belongs to family stuff
        if (itemProps.some((prop) => FAMILY_IDS_MAP[prop.id])) {
          //Remove all family props
          let translatedLabel;
          itemProps = itemProps.filter((prop) => {
            if (prop.id === FAMILY_PROP.id) translatedLabel = prop.label;
            return !FAMILY_IDS_MAP[prop.id];
          });

          if (translatedLabel) FAMILY_PROP.label = translatedLabel;

          //Add the Family tree fav currentProp
          itemProps = [FAMILY_PROP].concat(itemProps);

          //Select the family tree if no other currentProp is selected, or if it's a family currentProp
          if (!_currentProp || FAMILY_IDS_MAP[_currentProp.id]) {
            setCurrentProp(FAMILY_PROP);
          } else {
            setCurrentProp(_currentProp);
          }
        } else {
          setCurrentProp(_currentProp);
        }
        setAvailableProps(itemProps);
        //Set here (short setCurrentProp) otherwise if there is a delay between entity and props graph will be called twice
        setCurrentEntity(_currentEntity);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoadingEntity(false);
      setLoadingProps(false);
      setSearchTerm("");
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  React.useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      search(debouncedSearchTerm, currentLang.code).then(
        ({ data: { search: searchResults } }) => {
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
  }, [debouncedSearchTerm]);

  const history = useHistory();
  React.useEffect(() => {
    if (currentEntity) {
      const query = { q: currentEntity.id };

      if (currentProp) {
        query.p = currentProp.id;
      }
      if (currentLang.code !== DEFAULT_LANG.code) query.l = currentLang.code;
      const searchString = qs.stringify(query);
      history.push({
        search: "?" + searchString,
      });
    }
  }, [currentEntity, currentProp]);

  const propToggleRef = useRef();
  return (
    <Form className="SearchBar">
      <Container>
        <Form.Group className="searchBox" controlId="searchBox">
          <InputGroup>
            <Form.Control
              onKeyDown={() => setFromKeyboard(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              value={
                loadingEntity
                  ? "Loading entity..."
                  : searchTerm
                  ? searchTerm
                  : currentEntity
                  ? currentEntity.label
                  : ""
              }
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
                    disabled={loadingProps}
                    variant="none"
                    ref={propToggleRef}
                    id="dropdown-props"
                    className={
                      currentEntity &&
                      !currentProp &&
                      "shouldSelectProp btn-warning"
                    }
                  >
                    {loadingProps
                      ? "loading props..."
                      : currentProp
                      ? currentProp.overrideLabel || currentProp.label
                      : "Choose a property "}
                  </Dropdown.Toggle>

                  <Dropdown.Menu alignRight>
                    {availableProps.map((prop) => (
                      <Dropdown.Item
                        key={prop.id}
                        className={prop.isFav ? "fav" : ""}
                        onClick={() => setCurrentProp(prop)}
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
              loadEntity={loadEntity}
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
  loadEntity,
  setShowSuggestions,
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
            loadEntity(result.id);
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
