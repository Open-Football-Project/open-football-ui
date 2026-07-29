import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent, AnalyticsEvent } from "../utils/analytics/analytics";

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent(AnalyticsEvent.PAGE_VIEW, {
      page_path: location.pathname + location.search,
    });
  }, [location]);
};

export default usePageTracking;
