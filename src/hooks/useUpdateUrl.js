import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../App";

const useUpdateUrl = () => {
  const { currentEntity, currentProp, currentLang } = useContext(AppContext);

  const history = useHistory();
  useEffect(() => {
    if (currentEntity) {
      history.push({
        pathname: `/${currentLang.code}/${
          currentProp ? encodeURIComponent(currentProp.slug) : "all"
        }/${
          currentEntity.wikipediaSlug
            ? currentEntity.wikipediaSlug
            : currentEntity.id
        }`,
      });
    }
  }, [currentEntity, currentProp, currentLang, history]);
};

export default useUpdateUrl;
