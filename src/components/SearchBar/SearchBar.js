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
  } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loadingEntity, setLoadingEntity] = React.useState(false);
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
    if (_currentEntitId) {
      setLoadingEntity(true);
      const _currentEntity = await getItem(_currentEntitId, currentLang.code);
      setFromKeyboard(false);
      setSearchTerm(_currentEntity.label);
      setLoadingEntity(false);
      let _currentProp;
      if (_currentPropId) {
        _currentProp = await getItem(_currentPropId, currentLang.code);
      }
      await loadProps(_currentEntity, _currentProp);
      setCurrentEntity(_currentEntity);
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  React.useEffect(() => {
    if (debouncedSearchTerm && fromKeyboard) {
      setShowSuggestions(true);
      setLoadingSuggestions(true);
      search(debouncedSearchTerm, currentLang.code).then(
        ({ data: { search: searchResults } }) => {
          if (currentLang.disambPageDesc) {
            searchResults = searchResults.filter(
              ({ description }) => description !== currentLang.disambPageDesc
            );
          }
          setLoadingSuggestions(false);
          setSearchResults(searchResults);
        }
      );
    } else {
      setLoadingSuggestions(false);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  //Get new props on entity change
  const loadProps = async (_currentEntity, _currentProp) => {
    setLoadingProps(true);
    try {
      let itemProps = await getItemProps(_currentEntity.id, currentLang.code);

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
    } catch (error) {
      showError(error);
    } finally {
      setLoadingProps(false);
    }
  };

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
  const [showPropTooltip, setShowPropTooltip] = useState(true);
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
              setFromKeyboard={setFromKeyboard}
              setSearchTerm={setSearchTerm}
              setShowSuggestions={setShowSuggestions}
              loadEntity={loadEntity}
              loadingSuggestions={loadingSuggestions}
              searchResults={searchResults}
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
