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

export default function SearchBar({ setCurrentEntity, setCurrentProp }) {
  const { currentLang, showError, hasLanguageChanged } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [entity, setEntity] = React.useState(null);
  const [prop, setProp] = React.useState(null);
  const [loadingEntity, setLoadingEntity] = React.useState(false);
  const [loadingProps, setLoadingProps] = React.useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState();
  const [fromKeyboard, setFromKeyboard] = React.useState(true);
  const [availableProps, setAvailableProps] = React.useState([]);
  const [show, setShow] = React.useState(false);

  //Check on mount if there are params in the url
  const location = useLocation();
  React.useEffect(() => {
    (async () => {
      try {
        let { q, p } = qs.parse(location.search);
        if (q) {
          //showInfo({ message: "Loading entity" });
          await loadEntity(q);
        }
        if (p) {
          setLoadingProps(true);
          const { id, label } = await getItem(p, currentLang.code);
          setProp({
            id,
            label,
          });
          setLoadingProps(false);
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
      setProp(null);
      (async () => {
        setLoadingProps(true);
        try {
          let itemProps = await getItemProps(entity.id, currentLang.code);

          //prop belongs to family stuff
          if (itemProps.some((prop) => FAMILY_IDS_MAP[prop.id])) {
            //Remove all family props
            let translatedLabel;
            itemProps = itemProps.filter((prop) => {
              if (prop.id === FAMILY_PROP.id) translatedLabel = prop.label;
              return !FAMILY_IDS_MAP[prop.id];
            });

            if (translatedLabel) FAMILY_PROP.label = translatedLabel;

            //Add the Family tree fav prop
            itemProps = [FAMILY_PROP].concat(itemProps);

            //Select the family tree if no other prop is selected, or if it's a family prop
            if (!prop || FAMILY_IDS_MAP[prop.id]) {
              setProp(FAMILY_PROP);
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
      setCurrentEntity(entity);
      if (prop) {
        query.p = prop.id;
        setCurrentProp(prop);
      }
      if (currentLang.code !== DEFAULT_LANG.code) query.l = currentLang.code;
      const searchString = qs.stringify(query);
      history.push({
        search: "?" + searchString,
      });
    }
  }, [entity, prop]);

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
                      : prop
                      ? prop.overrideLabel || prop.label
                      : "Choose a property "}
                  </Dropdown.Toggle>
                  <Dropdown.Menu alignRight>
                    {availableProps.map((prop) => (
                      <Dropdown.Item
                        key={prop.id + (prop.isFav ? "_fav" : "")}
                        onClick={() => setProp(prop)}
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
            <div>
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
