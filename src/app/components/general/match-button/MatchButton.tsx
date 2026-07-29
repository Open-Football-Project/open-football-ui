import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

interface MatchButtonProps {
  isLiveNow: boolean;
  fixtureId: number;
  tabIndex?: number;
  className?: string;
}

const MatchButton = React.forwardRef<HTMLAnchorElement, MatchButtonProps>(
  ({ isLiveNow, fixtureId, tabIndex, className }, ref) => {
    const { t } = useTranslation();
    return (
      <Link
        ref={ref}
        tabIndex={tabIndex}
        onClick={() =>
          trackEvent(
            isLiveNow ? AnalyticsEvent.LIVE_OPENED : AnalyticsEvent.MATCH_OPENED,
            { id: String(fixtureId) },
          )
        }
        to={isLiveNow ? `/live/${fixtureId}` : `/match/${fixtureId}`}
        className={`
          relative inline-flex items-center justify-center
          text-[10px] sm:text-xs font-semibold
          rounded-full shadow-md transition-all duration-300
          px-3 py-1 min-w-[60px]
          ${
            isLiveNow
              ? "text-brand-white bg-brand-success hover:bg-brand-red animate-pulse"
              : "text-white bg-brand-aqua hover:bg-brand-aqua/80"
          }
          ${className ?? ""}
        `}
      >
        <span data-testid={isLiveNow ? "live-now-link" : "match-details-link"}>
          {isLiveNow ? t("matchbtn.live") : t("matchbtn.detail")}
        </span>
      </Link>
    );
  },
);

export default MatchButton;
