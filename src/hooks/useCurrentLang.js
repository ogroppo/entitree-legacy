import { useContext, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import { AppContext } from "../App";
import { DEFAULT_LANG, LANGS } from "../constants/langs";

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

export default useCurrentLang;
