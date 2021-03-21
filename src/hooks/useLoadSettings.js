import { useContext, useEffect } from "react";

import { AppContext } from "../App";
import { STORED_SETTINGS_KEY } from "../constants/storage";
import ls from "local-storage";

const useLoadSettings = () => {
  const { setSettings } = useContext(AppContext);

  useEffect(() => {
    const storedSettings = ls(STORED_SETTINGS_KEY);
    if (storedSettings) setSettings(storedSettings);
  }, [setSettings]);
};

export default useLoadSettings;
