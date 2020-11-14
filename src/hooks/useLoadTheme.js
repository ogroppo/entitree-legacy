import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";
import { THEMES } from "../constants/themes";

const useLoadTheme = () => {
  const { setCurrentTheme } = useContext(AppContext);

  useEffect(() => {
    const storedThemeKey = ls("storedThemeKey");
    const theme = THEMES.find(({ name }) => storedThemeKey === name);
    if (!theme) {
      ls("storedThemeKey", "Default");
      setCurrentTheme(THEMES[0], false);
    } else setCurrentTheme(theme, false);
  }, [setCurrentTheme]);
};

export default useLoadTheme;
