import {
  STORED_CUSTOM_THEME_PREFIX_KEY,
  STORED_THEME_KEY,
  STORED_VERSION_KEY,
} from "../constants/storage";
import { THEMES, defaultTheme } from "../constants/themes";
import { useContext, useEffect } from "react";

import { AppContext } from "../App";
import ls from "local-storage";

const useLoadTheme = () => {
  const { setCurrentTheme, setCustomTheme } = useContext(AppContext);

  useEffect(() => {
    //This should be moved in its own hook and executed first
    const currentLsVersion = 4;
    const lsVersion = ls(STORED_VERSION_KEY);
    if (!lsVersion || lsVersion !== currentLsVersion) {
      ls.clear(); // Make sure the client does not hold outdated structures
      ls(STORED_VERSION_KEY, currentLsVersion);
    }
    const storedThemeKey = ls(STORED_THEME_KEY);
    const storedCustomTheme = ls(
      STORED_CUSTOM_THEME_PREFIX_KEY + storedThemeKey
    );

    if (!storedThemeKey) {
      setCurrentTheme(defaultTheme, false);
      setCustomTheme(defaultTheme);
    } else {
      const theme = THEMES.find(({ name }) => storedThemeKey === name);

      if (theme) {
        if (storedCustomTheme) {
          const consolidatedCustomTheme = { ...theme, ...storedCustomTheme };
          setCurrentTheme(consolidatedCustomTheme, false);
          setCustomTheme(consolidatedCustomTheme);
        } else {
          setCurrentTheme(theme, false);
          setCustomTheme(theme);
        }
      } else {
        // The stored theme name is corrupted
        ls.remove(STORED_THEME_KEY);
        // Fallback to Default theme
        setCurrentTheme(defaultTheme, false);
      }
    }
  }, [setCurrentTheme, setCustomTheme]);
};

export default useLoadTheme;
