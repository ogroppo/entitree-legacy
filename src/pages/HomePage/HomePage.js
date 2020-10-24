import React, { useEffect, useContext, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Graph from "../../components/Graph/Graph";
import { useHistory, useRouteMatch } from "react-router-dom";
import { AppContext } from "../../App";
import { GiFamilyTree } from "react-icons/gi";
import { Spinner } from "react-bootstrap";
import Header from "../../layout/Header/Header";
import { LANGS, DEFAULT_LANG } from "../../constants/langs";
import { Helmet } from "react-helmet";
import { DEFAULT_DESC, SITE_NAME } from "../../constants/meta";
import usePageView from "../../lib/usePageView";
import enSlugs from "../../sitemap/en-slugs.json";
import getItem from "../../wikidata/getItem";
import getItemProps from "../../wikidata/getItemProps";
import getWikipediaArticle from "../../wikipedia/getWikipediaArticle";
import {
  FAMILY_PROP,
  FAMILY_IDS_MAP,
  CHILD_ID,
} from "../../constants/properties";
import "./HomePage.scss";

function HomePage() {
  usePageView();
  useUpdateUrl();
  useLoadFromUrl();
  const {
    currentEntity,
    loadingEntity,
    currentProp,
    currentLang,
    showError,
    currentEntityId,
    setLoadingEntity,
    currentPropSlug,
    currentPropId,
    setCurrentProp,
    setCurrentEntity,
  } = useContext(AppContext);

  useEffect(() => {
    const loadEntity = async () => {
      console.log("loadEntity");
      try {
        setCurrentEntity(null);
        setLoadingEntity(true);

        let [_currentEntity, itemProps] = await Promise.all([
          getItem(currentEntityId, currentLang.code),
          getItemProps(currentEntityId, currentLang.code),
        ]);

        itemProps.forEach((prop) => {
          prop.slug = prop.label.replace(/\s/g, "_");
        });

        let _currentProp;
        if (currentPropSlug) {
          _currentProp = itemProps.find(({ slug }) => slug === currentPropSlug);
        }
        if (currentPropId) {
          _currentProp = itemProps.find(({ id }) => id === currentPropId);
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

        _currentEntity.availableProps = itemProps;

        //Set here (short after setCurrentProp) otherwise if there is a delay between entity and props graph will be called twice
        setCurrentEntity(_currentEntity);
      } catch (error) {
        showError(error);
      } finally {
        setLoadingEntity(false);
      }
    };
    if (currentLang && currentEntityId) {
      loadEntity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntityId, currentLang]);

  return (
    <div className="HomePage">
      {currentEntity ? (
        <Helmet>
          <title>
            {currentEntity.label}
            {currentProp
              ? ` - ${currentProp.overrideLabel || currentProp.label}`
              : ""}{" "}
            - {SITE_NAME}
          </title>
          {currentEntity.description && (
            <meta name="description" content={currentEntity.description} />
          )}
        </Helmet>
      ) : (
        <Helmet>
          <meta name="description" content={DEFAULT_DESC} />
        </Helmet>
      )}
      <Header />
      <SearchBar />
      {loadingEntity && (
        <div className="graphPlaceholder">
          <div className="center">
            <Spinner animation="grow" />
            <div>Loading tree</div>
          </div>
        </div>
      )}
      {!loadingEntity && !currentEntity && (
        <div className="graphPlaceholder">
          <div className="center">
            <GiFamilyTree />
            <div>Start a new search or choose from the examples</div>
          </div>
        </div>
      )}
      {currentEntity && <Graph />}
    </div>
  );
}

const useLoadFromUrl = () => {
  const {
    currentLang,
    showError,
    setCurrentEntityId,
    setCurrentPropSlug,
  } = useContext(AppContext);
  const match = useRouteMatch();
  useEffect(() => {
    (async () => {
      try {
        const { itemSlug, propSlug } = match.params;
        if (itemSlug) {
          let itemId;
          if (itemSlug.match(/^Q\d+$/)) {
            itemId = itemSlug;
          } else {
            const slugItem = enSlugs[itemSlug];
            if (slugItem) {
              itemId = slugItem.id;
            } else {
              const { wikibase_item } = await getWikipediaArticle(
                itemSlug,
                currentLang.code
              );
              if (wikibase_item) itemId = wikibase_item;
            }
          }
          if (itemId) setCurrentEntityId(itemId);
        }

        if (propSlug) setCurrentPropSlug(propSlug);
      } catch (error) {
        showError(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

const useUpdateUrl = () => {
  const { currentEntity, currentProp, currentLang } = useContext(AppContext);

  const history = useHistory();
  useEffect(() => {
    if (currentEntity) {
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
  }, [currentEntity, currentProp, currentLang, history]);
};

const useCurrentLang = () => {
  const { setCurrentLang } = useContext(AppContext);

  const match = useRouteMatch();
  let { langCode } = match.params;

  useEffect(() => {
    let currentLangCode;
    if (langCode) {
      currentLangCode = langCode;
    } else {
      try {
        currentLangCode = localStorage.getItem("userLangCode");
      } catch (error) {
        //localstorage not working
      }
    }

    if (currentLangCode) {
      const currentLang = LANGS.find(({ code }) => code === currentLangCode);
      if (currentLang) setCurrentLang(currentLang);
      else setCurrentLang(DEFAULT_LANG);
    } else {
      setCurrentLang(DEFAULT_LANG);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default function LangLoader() {
  useCurrentLang();
  const { currentLang } = useContext(AppContext);

  if (!currentLang) return null;

  return <HomePage />;
}
