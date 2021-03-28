import { DEFAULT_LANG, LANGS } from "../constants/langs";
import {
  STORED_LANG_CODE_KEY,
  STORED_SECOND_LANG_CODE_KEY,
} from "../constants/storage";
import { useContext, useEffect } from "react";

import { AppContext } from "../App";
import ls from "local-storage";
import { useRouteMatch } from "react-router-dom";

const useCurrentLang = () => {
  const { setCurrentLang, setSecondLabel } = useContext(AppContext);

  const match = useRouteMatch();

  useEffect(() => {
    //Set primary language
    const { langCode } = match.params;
    let currentLangCode;
    if (langCode) {
      currentLangCode = langCode;
    } else {
      currentLangCode = ls(STORED_LANG_CODE_KEY);
    }

    if (currentLangCode) {
      const currentLang = LANGS.find(({ code }) => code === currentLangCode);
      if (currentLang) setCurrentLang(currentLang);
      else setCurrentLang(DEFAULT_LANG);
    } else {
      setCurrentLang(DEFAULT_LANG);
    }

    //Set second label/language
    const secondLabelCode = ls(STORED_SECOND_LANG_CODE_KEY);
    if (secondLabelCode) {
      const currentSecondLabel = LANGS.find(
        ({ code }) => code === secondLabelCode
      );
      if (currentSecondLabel) setSecondLabel(currentSecondLabel);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCurrentLang;
