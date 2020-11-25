import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";
import { THEMES, defaultTheme } from "../constants/themes";

const useLoadTheme = () => {
  const { setCurrentTheme, setCustomTheme } = useContext(AppContext);

  useEffect(() => {
    const storedThemeKey = ls("storedThemeKey");
    if (!storedThemeKey) {
      setCurrentTheme(defaultTheme, false);
    } else {
      if (storedThemeKey === "Custom") {
        const customTheme = ls("customTheme");
        if (!customTheme) {
          ls.remove("storedThemeKey");
          setCurrentTheme(defaultTheme, false);
        } else {
          setCustomTheme(customTheme);
          setCurrentTheme(customTheme, false);
        }
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
