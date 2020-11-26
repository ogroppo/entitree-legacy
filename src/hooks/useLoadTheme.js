import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";
import { THEMES, defaultTheme, defaultCustomTheme } from "../constants/themes";

const useLoadTheme = () => {
  const { setCurrentTheme, setCustomTheme } = useContext(AppContext);

  useEffect(() => {
    const storedThemeKey = ls("storedThemeKey");
    const storedCustomTheme = ls("storedCustomTheme");
    if (storedCustomTheme) {
      setCustomTheme(storedCustomTheme);
    }
    if (!storedThemeKey) {
      setCurrentTheme(defaultTheme, false);
    } else {
      if (storedThemeKey === "Custom") {
        setCurrentTheme(storedCustomTheme || defaultCustomTheme, false);
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
