import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

export default function usePageView() {
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }, [location.pathname]);
}
