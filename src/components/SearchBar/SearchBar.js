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
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  FAMILY_PROP,
  FAMILY_IDS_MAP,
  CHILD_ID,
} from "../../constants/properties";
import { AppContext } from "../../App";
import getItems from "../../wikidata/getItems";
import getItemProps from "../../wikidata/getItemProps";
import search from "../../wikidata/search";
import enSlugs from "../../sitemap/en-slugs.json";
import getWikipediaArticle from "../../wikipedia/getWikipediaArticle";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProps, setLoadingProps] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState();
  const [fromKeyboard, setFromKeyboard] = useState(true);
  const [availableProps, setAvailableProps] = useState([]);

  //Check on mount if there are params in the url
  const location = useLocation();
  const match = useRouteMatch();
  useEffect(() => {
    (async () => {
      try {
        let itemId;
        if (match.params.itemSlug) {
          if (match.params.itemSlug.match(/^Q\d+$/)) {
            itemId = match.params.itemSlug;
          } else {
            const slugItem = enSlugs[match.params.itemSlug];
            if (slugItem) {
              itemId = slugItem.id;
            } else {
              const { wikibase_item } = await getWikipediaArticle(
                match.params.itemSlug,
                currentLang.code
              );
              if (wikibase_item) itemId = wikibase_item;
            }
          }
        }

        loadEntity(itemId, match.params.propSlug);
      } catch (error) {
        showError(error);
      }
    })();
  }, []);

  //reload entity on lang change
  useEffect(() => {
    if (hasLanguageChanged) {
      (async () => {
        try {
          if (currentEntity)
            await loadEntity(
              currentEntity.id,
              null,
              currentProp ? currentProp.id : null //this doesn't work if I switch language
            );
        } catch (error) {
          showError(error);
        }
      })();
    }
  }, [hasLanguageChanged]);

  const loadEntity = async (_currentEntityId, propSlug, propId) => {
    if (!_currentEntityId) return;
    try {
      if (currentEntity && _currentEntityId !== currentEntity.id)
        setCurrentEntity(null); //avoids weird caching behaviour, get a fresh one
      // if(currentProp && propId !== currentProp.id)
      //   setCurrentProp(null); //avoids weird caching behaviour, get a fresh one

      setFromKeyboard(false);
      setLoadingEntity(true);
      setLoadingProps(true);

      let [_currentEntity, itemProps] = await Promise.all([
        getItems([_currentEntityId], [currentLang.code, secondLang.code]),
        getItemProps(_currentEntityId, currentLang.code),
      ]);
      _currentEntity = _currentEntity[0];

      itemProps.forEach((prop) => {
        prop.slug = prop.label.replace(/\s/g, "_");
      });

      let _currentProp;
      if (propSlug) {
        _currentProp = itemProps.find(({ slug }) => slug === propSlug);
      }
      if (propId) {
        _currentProp = itemProps.find(({ id }) => id === propId);
      }

      //currentProp belongs to family stuff
      if (itemProps.some((prop) => FAMILY_IDS_MAP[prop.id])) {
        //Remove all family-related props in favour of the custom
        itemProps = itemProps.filter((prop) => {
          if (prop.id === CHILD_ID) FAMILY_PROP.label = prop.label; //get translated child label
          return !FAMILY_IDS_MAP[prop.id];
        });

        const translatedFamilyTree =
          FAMILY_PROP.overrideLabels[currentLang.code];
        if (translatedFamilyTree) {
          FAMILY_PROP.overrideLabel = translatedFamilyTree;
          FAMILY_PROP.slug = translatedFamilyTree.replace(/\s/g, "_");
        }

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
      //Set here (short after setCurrentProp) otherwise if there is a delay between entity and props graph will be called twice
      setCurrentEntity(_currentEntity);
    } catch (error) {
      showError(error);
    } finally {
      setLoadingEntity(false);
      setLoadingProps(false);
    }
  };

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
  }, [debouncedSearchTerm]);

  const history = useHistory();
  useEffect(() => {
    if (currentEntity) {
      setSearchTerm(currentEntity.label); //if updates from graph (reloadTreeFromFocused)
      history.push({
        pathname: `/${currentLang.code}/${
          currentProp ? currentProp.slug : "all"
        }/${
          currentEntity.wikipediaSlug
            ? currentEntity.wikipediaSlug
            : currentEntity.id
        }`,
      });
    }
  }, [currentEntity, currentProp]);

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
