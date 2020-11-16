import { useContext, useEffect } from "react";
import { AppContext } from "../App";
import ls from "local-storage";

const useLoadSettings = () => {
  const { setSettings, setCurrentTheme } = useContext(AppContext);

  useEffect(() => {
    const storedSettings = ls("settings");
    if (storedSettings) setSettings(storedSettings);
  }, [setCurrentTheme, setSettings]);
};

export default useLoadSettings;
