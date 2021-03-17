import { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { AppContext } from "../App";
import { DEFAULT_PROPERTY_ALL } from "../constants/properties";

const useUpdateUrl = () => {
  const { currentEntity, currentProp, currentLang } = useContext(AppContext);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (currentEntity) {
      console.log(location.search);
      history.push({
        pathname: `/${currentLang.code}/${
          currentProp
            ? encodeURIComponent(currentProp.slug)
            : DEFAULT_PROPERTY_ALL
        }/${
          currentEntity.wikipediaSlug
            ? currentEntity.wikipediaSlug
            : currentEntity.id
        }`,
        search: location.search,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEntity, currentProp, currentLang]);
};

export default useUpdateUrl;
