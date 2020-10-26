import { useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { AppContext } from "../App";
import getItem from "../wikidata/getItem";
import getItemProps from "../wikidata/getItemProps";
import { FAMILY_PROP, FAMILY_IDS_MAP, CHILD_ID } from "../constants/properties";
import getUpMap from "../wikidata/getUpMap";
import addEntityConnectors from "../lib/addEntityConnectors";

const useLoadEntity = () => {
  const {
    currentLang,
    showError,
    currentEntityId,
    setLoadingEntity,
    currentPropId,
    setState,
    setCurrentUpMap,
  } = useContext(AppContext);

  const match = useRouteMatch();
  useEffect(() => {
    const loadEntity = async () => {
      try {
        setState({
          currentEntity: null,
          loadingEntity: true,
        });

        // TODO: cache this
        let [_currentEntity, itemProps] = await Promise.all([
          getItem(currentEntityId, currentLang.code),
          getItemProps(currentEntityId, currentLang.code),
        ]);

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
          if (propSlug && propSlug !== "all")
            _currentProp = itemProps.find(({ slug }) => slug === propSlug);
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
          // TODO: cache this
          const upMap = await getUpMap(_currentEntity.id, _currentProp.id);

          addEntityConnectors(_currentEntity, _currentProp.id, {
            upMap,
            addDownIds: true,
            addRightIds: _currentProp.id === CHILD_ID,
            addLeftIds: _currentProp.id === CHILD_ID,
          });

          setCurrentUpMap(upMap);
        }

        //Set here (short after setCurrentProp) otherwise if there is a delay between entity and props graph will be called twice
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
  }, [currentLang, currentEntityId, currentPropId]);
};

export default useLoadEntity;
