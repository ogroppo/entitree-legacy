import { useContext, useEffect, useMemo } from "react";
import { useRouteMatch } from "react-router-dom";
import { AppContext } from "../App";
import getItem from "../wikidata/getItem";
import getItemProps from "../wikidata/getItemProps";
import { FAMILY_PROP, FAMILY_IDS_MAP, CHILD_ID } from "../constants/properties";
import getUpMap from "../wikidata/getUpMap";
import addEntityConnectors from "../lib/addEntityConnectors";
import { useTheme } from "styled-components";
import usePrevious from "./usePrevious";

const useLoadEntity = () => {
  const {
    currentLang,
    showError,
    currentEntityId,
    currentEntity,
    setLoadingEntity,
    currentPropId,
    setState,
    settings,
    setCurrentUpMap,
    secondLabel,
  } = useContext(AppContext);

  const match = useRouteMatch();
  const theme = useTheme();

  const getItemMemo = useMemo(() => {
    if (currentEntityId)
      return Promise.all([
        getItem(currentEntityId, currentLang.code, theme, { secondLabel }),
        getItemProps(currentEntityId, currentLang.code),
      ]);
  }, [currentEntityId, currentLang.code, secondLabel, theme]);

  const previousRightEntityOption = usePrevious(settings.rightEntityOption);

  useEffect(() => {
    const loadEntity = async () => {
      try {
        // show loading when whe changed entity from searchbar
        if (currentEntity && currentEntityId !== currentEntity.id)
          setState({
            currentEntity: null,
            loadingEntity: true,
          });

        //The root node needs to go through the whole process of toggling spouses (Graph)
        if (settings.rightEntityOption !== previousRightEntityOption)
          setState({
            currentEntity: null,
            loadingEntity: true,
          });

        // show loading when coming from url
        if (!currentEntity) setLoadingEntity(true);

        let [_currentEntity, itemProps] = await getItemMemo;

        if (!_currentEntity) {
          throw new Error(`Entity not found ${currentEntityId}`);
        }

        itemProps.forEach((prop) => {
          prop.slug = prop.label.replace(/\s/g, "_");
        });

        let _currentProp;
        if (currentPropId) {
          //is coming from a node change or language change, try to use the same prop id
          _currentProp = itemProps.find(({ id }) => id === currentPropId);
        } else {
          //is coming from url
          const { propSlug } = match.params;
          const decodedPropSlug = decodeURIComponent(propSlug);
          if (decodedPropSlug && decodedPropSlug !== "all")
            _currentProp = itemProps.find(
              ({ slug }) => slug === decodedPropSlug
            );
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
            _currentProp = FAMILY_PROP;
          }
        }

        _currentEntity.availableProps = itemProps;

        if (_currentProp) {
          const upMap = await getUpMap(_currentEntity.id, _currentProp.id);

          addEntityConnectors(_currentEntity, _currentProp.id, {
            upMap,
            addDownIds: true,
            addRightIds: _currentProp.id === CHILD_ID,
            addLeftIds: _currentProp.id === CHILD_ID,
            rightEntityOption: settings.rightEntityOption,
          });

          setCurrentUpMap(upMap);
        }

        setState({
          currentProp: _currentProp,
          currentEntity: _currentEntity,
          loadingEntity: false,
        });
      } catch (error) {
        showError(error);
        setLoadingEntity(false);
      }
    };
    if (currentLang && currentEntityId) {
      loadEntity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentLang,
    secondLabel,
    currentEntityId,
    currentPropId,
    settings.rightEntityOption,
  ]);
};

export default useLoadEntity;
