import React, { useContext } from "react";
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
  InputGroup,
} from "react-bootstrap";
import { search, getItem, getItemTypes, getItemProps } from "../../lib/api";
import qs from "query-string";
import { useHistory, useLocation } from "react-router-dom";
import { preferredProps } from "../../constants/properties";
import { AppContext } from "../../App";
import { FaStar } from "react-icons/fa";

export default function SearchBar({ setCurrentEntityId, setCurrentPropId }) {
  const { showInfo, currentLang, showError } = useContext(AppContext);
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
          const entity = await getItem(q);
          setFromKeyboard(false);
          setSearchTerm(entity.labels.en.value);
          setEntityId(entity.id);
        }
        if (p) {
          //showInfo({ message: "Loading property" });
          const prop = await getItem(p);
          setProp({
            id: prop.id,
            label: prop.labels.en.value,
          });
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
    if (entityId) {
      (async () => {
        const types = await getItemTypes(entityId);

        let props = [];
        types.forEach((type) => {
          if (preferredProps[type.id])
            props = props.concat(preferredProps[type.id]);
        });
        //not in mapping, get them all
        const normalProps = await getItemProps(entityId);
        props.push(...normalProps);

        setAvailableProps(props);
      })();
    }
  }, [entityId]);

  React.useEffect(() => {
    submit();
  }, [prop.id]);

  const history = useHistory();
  const submit = (e) => {
    if (!prop.id || !entityId) return;
    const query = { q: entityId, p: prop.id };
    const searchString = qs.stringify(query);
    history.push({
      search: "?" + searchString,
    });
    setCurrentEntityId(entityId);
    setCurrentPropId(prop.id);
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
              value={searchTerm}
              type="search"
              placeholder="Start typing to search..."
              autoComplete="off"
            />
            {entityId && (
              <InputGroup.Append>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={!availableProps.length}
                    variant="none"
                    id="dropdown-props"
                  >
                    {prop.id ? prop.label : "Choose a property "}
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
              setEntityId={setEntityId}
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
