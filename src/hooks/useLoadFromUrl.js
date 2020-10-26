import getWikipediaArticle from "../wikipedia/getWikipediaArticle";
import enSlugs from "../sitemap/en-slugs.json";

import { useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { AppContext } from "../App";

const useLoadFromUrl = () => {
  const { currentLang, showError, setCurrentEntityId } = useContext(AppContext);
  const match = useRouteMatch();
  useEffect(() => {
    (async () => {
      try {
        const { itemSlug } = match.params;
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
      } catch (error) {
        showError(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useLoadFromUrl;
