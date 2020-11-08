import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";

const useSettings = () => {
  const { setSettings, setCurrentTheme } = useContext(AppContext);

  useEffect(() => {
    const storedSettings = ls("settings");
    if (storedSettings) setSettings(storedSettings);

    const storedTheme = ls("storedTheme");
    if (storedTheme) setCurrentTheme(storedTheme, false);
  }, [setCurrentTheme, setSettings]);
};

export default useSettings;
