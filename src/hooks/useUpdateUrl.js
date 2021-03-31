import { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { AppContext } from "../App";
import { DEFAULT_PROPERTY_ALL } from "../constants/properties";
import usePrevious from "./usePrevious";

const useUpdateUrl = () => {
  const {
    currentEntity,
    currentEntityId,
    currentProp,
    currentLang,
  } = useContext(AppContext);

  const history = useHistory();
  const location = useLocation();

  const prevEntityId = usePrevious(currentEntityId);
  const prevProp = usePrevious(currentProp);

  useEffect(() => {
    if (currentEntity) {
      const hasChangedContext =
        (currentEntityId && prevEntityId && prevEntityId !== currentEntityId) ||
        (currentProp && prevProp && prevProp.id !== currentProp.id);

      history.push({
        pathname: `/${currentLang.code}/${
          currentProp
            ? encodeURIComponent(currentProp.slug)
            : DEFAULT_PROPERTY_ALL
        }/${currentEntity.wikipediaSlug || currentEntity.id}`,
        //if changed either entity or prop (but not lang) reset the bookmarks
        search: hasChangedContext ? undefined : location.search,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntity, currentProp, currentLang, currentEntityId]);
};

export default useUpdateUrl;
