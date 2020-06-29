import React, { useContext } from "react";
import useDebounce from "../../lib/useDebounce";
import "./SearchBar.scss";
import {
  Form,
  Spinner,
  Button,
  Dropdown,
  Container,
  InputGroup,
} from "react-bootstrap";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { preferredProps } from "../../constants/properties";
import { AppContext } from "../../App";
import { FaStar } from "react-icons/fa";
import getItem from "../../wikidata/getItem";
import getItemProps from "../../wikidata/getItemProps";
import search from "../../wikidata/search";
import { DEFAULT_LANG } from "../../constants/langs";

export default function SearchBar({ setCurrentEntity, setCurrentProp }) {
  const { currentLang, showError } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [entity, setEntity] = React.useState({});
  const [loadingEntity, setLoadingEntity] = React.useState(false);
  const [loadingProps, setLoadingProps] = React.useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState();
  const [fromKeyboard, setFromKeyboard] = React.useState(true);
  const [availableProps, setAvailableProps] = React.useState([]);
  const [prop, setProp] = React.useState({});

  //Check on mount if there are params in the url
  const location = useLocation();
  React.useEffect(() => {
    (async () => {
      try {
        let { q } = qs.parse(location.search);
        if (q) {
          //showInfo({ message: "Loading entity" });
          await loadEntity(q);
        }
      } catch (error) {
        showError(error);
      }
    })();
  }, []);

  const loadEntity = async (id) => {
    setLoadingEntity(true);
    const entity = await getItem(id, currentLang.code);
    setLoadingEntity(false);
    setFromKeyboard(false);
    setSearchTerm(entity.label);
    setEntity(entity);
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
  React.useEffect(() => {
    setProp({});

    if (entity.id) {
      (async () => {
        setLoadingProps(true);
        try {
          let { p } = qs.parse(location.search);
          if (p) {
            //showInfo({ message: "Loading property" });
            const prop = await getItem(p, currentLang.code);
            setProp(prop);
          }

          let props = [];
          //not in mapping, get them all
          const normalProps = await getItemProps(entity.id, currentLang.code);
          props.push(...normalProps);

          setAvailableProps(props);
          setLoadingProps(false);
        } catch (error) {
          showError(error);
        }
      })();
    }
  }, [entity.id]);

  React.useEffect(() => {
    if (prop.id) {
      submit();
    }
  }, [prop.id]);

  const history = useHistory();
  const submit = (e) => {
    if (!prop.id || !entity.id) return;
    const query = { q: entity.id, p: prop.id };
    if (currentLang.code !== DEFAULT_LANG.code) query.l = currentLang.code;
    const searchString = qs.stringify(query);
    history.push({
      search: "?" + searchString,
    });
    setCurrentEntity(entity);
    setCurrentProp(prop);
  };

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
            {entity.id && (
              <InputGroup.Append>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={loadingProps}
                    variant="none"
                    id="dropdown-props"
                  >
                    {loadingProps
                      ? "loading props..."
                      : prop.id
                      ? prop.label
                      : "Choose a property "}
                  </Dropdown.Toggle>
                  <Dropdown.Menu alignRight>
                    {availableProps.map((prop) => (
                      <Dropdown.Item
                        key={prop.id + (prop.isFav ? "_fav" : "")}
                        onClick={() => setProp(prop)}
                      >
                        {prop.isFav && <FaStar />} {prop.label}
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
