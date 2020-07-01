import React, { useContext, useState } from "react";
import useDebounce from "../../lib/useDebounce";
import "./SearchBar.scss";
import {
  Form,
  Spinner,
  Button,
  Dropdown,
  Container,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { FiSliders } from "react-icons/fi";
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
  const [entity, setEntity] = React.useState(null);
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
        if (q) {
          await loadEntity(q);
          if (p) {
            setLoadingProp(true); //not used
            const { id, label } = await getItem(p, currentLang.code);
            setCurrentProp({
              id,
              label,
            });
            setLoadingProp(false);
          }
        }
      } catch (error) {
        showError(error);
      }
    })();
  }, []);

  //reload entity on lang change
  React.useEffect(() => {
    if (hasLanguageChanged)
      (async () => {
        try {
          if (entity) await loadEntity(entity.id);
        } catch (error) {
          showError(error);
        }
      })();
  }, [hasLanguageChanged]);

  const loadEntity = async (id) => {
    setLoadingEntity(true);
    const entity = await getItem(id, currentLang.code);
    setLoadingEntity(false);
    setFromKeyboard(false);
    setSearchTerm(entity.label);
    setEntity(entity);
    setCurrentEntity(entity); //They used to have separate behaviours but can be merged now, I think
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
    if (entity) {
      setCurrentProp(null);
      (async () => {
        setLoadingProps(true);
        try {
          let itemProps = await getItemProps(entity.id, currentLang.code);

          //currentProp belongs to family stuff
          if (itemProps.some((currentProp) => FAMILY_IDS_MAP[currentProp.id])) {
            //Remove all family props
            let translatedLabel;
            itemProps = itemProps.filter((currentProp) => {
              if (currentProp.id === FAMILY_PROP.id)
                translatedLabel = currentProp.label;
              return !FAMILY_IDS_MAP[currentProp.id];
            });

            if (translatedLabel) FAMILY_PROP.label = translatedLabel;

            //Add the Family tree fav currentProp
            itemProps = [FAMILY_PROP].concat(itemProps);

            //Select the family tree if no other currentProp is selected, or if it's a family currentProp
            if (!currentProp || FAMILY_IDS_MAP[currentProp.id]) {
              setCurrentProp(FAMILY_PROP);
            }
          }

          setAvailableProps(itemProps);
        } catch (error) {
          showError(error);
        } finally {
          setLoadingProps(false);
        }
      })();
    }
  }, [entity]);

  const history = useHistory();
  React.useEffect(() => {
    if (entity) {
      const query = { q: entity.id };

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
            {entity && (
              <InputGroup.Append>
                <Dropdown>
                  <Dropdown.Toggle
                    disabled={loadingProps}
                    variant="none"
                    id="dropdown-props"
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
                        key={prop.id + (prop.isFav ? "_fav" : "")}
                        onClick={() => setCurrentProp(prop)}
                      >
                        {prop.isFav && <FaStar />}{" "}
                        {prop.overrideLabel || prop.label}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </InputGroup.Append>
            )}
            <ModalSettings />
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

function ModalSettings() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const options = [
    {
      id: "genderColors",
      label: "Use Color based on gender",
    },
    {
      id: "birthName",
      label: "Use Birthname",
    },
    {
      id: "birthPlace",
      label: "Show birthplace instead of hospital",
    },
  ];
  const showButton = false;
  return (
    <>
      <Button
        variant="primary"
        onClick={handleShow}
        style={{ visibility: showButton ? "visible" : "hidden" }}
      >
        <FiSliders />
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please select (beta)
          <br />
          {options.map((option) => (
            <div key={option.id}>
              <label>
                <input
                  name="isGoing"
                  type="checkbox"
                  // checked={this.state.isGoing}
                  // onChange={this.handleInputChange}
                />
                {option.label}
              </label>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
