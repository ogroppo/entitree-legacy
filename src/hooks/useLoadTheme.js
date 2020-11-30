import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";
import { THEMES, defaultTheme, defaultCustomTheme } from "../constants/themes";

const useLoadTheme = () => {
  const { setCurrentTheme, setCustomTheme } = useContext(AppContext);

  useEffect(() => {
    const storedThemeKey = ls("storedThemeKey");
    const storedCustomTheme = ls("storedCustomTheme");
    const consolidatedCustomTheme = {
      ...defaultCustomTheme, //localStorage might be corrupted, keep defaults
      ...(storedCustomTheme || {}), //todo, remove extra props stored
    };
    if (storedCustomTheme) {
      setCustomTheme(consolidatedCustomTheme);
    }
    if (!storedThemeKey) {
      setCurrentTheme(defaultTheme, false);
    } else {
      if (storedThemeKey === "Custom") {
        setCurrentTheme(consolidatedCustomTheme, false);
      } else {
        const theme = THEMES.find(({ name }) => storedThemeKey === name);
        if (!theme) {
          ls.remove("storedThemeKey");
          setCurrentTheme(defaultTheme, false);
        } else setCurrentTheme(theme, false);
      }
    }
  }, [setCurrentTheme, setCustomTheme]);
};

export default useLoadTheme;
