import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";
import { THEMES, defaultTheme } from "../constants/themes";

const useLoadTheme = () => {
  const { setCurrentTheme, setCustomTheme } = useContext(AppContext);

  useEffect(() => {
    const currentLsVersion = 1;
    const lsVersion = ls("lsVersion");
    if (!lsVersion || lsVersion !== currentLsVersion) {
      ls.clear(); // Make sure the client does not hold outdated structures
      ls("lsVersion", currentLsVersion);
    }
    const storedThemeKey = ls("storedThemeKey");
    const storedCustomTheme = ls("storedCustomTheme_" + storedThemeKey);

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
        ls.remove("storedThemeKey");
        // Fallback to Default theme
        setCurrentTheme(defaultTheme, false);
      }
    }
  }, [setCurrentTheme, setCustomTheme]);
};

export default useLoadTheme;
