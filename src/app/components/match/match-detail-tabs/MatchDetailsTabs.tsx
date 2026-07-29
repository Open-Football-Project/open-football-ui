import { useState } from "react";
import NoData from "../../general/no-data/NoData";
import MatchEventsTable from "../match-events-table/MatchEventsTable";
import MatchStats from "../match-stats/MatchStats";
import {
  TeamsLineups,
  MatchEvent,
  TwoTeamsStatistics,
} from "@matchinsights/core";

import MatchLineups from "../match-lineups/MatchLineups";
import { useTranslation } from "react-i18next";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";

interface MatchDetailsTabsProps {
  matchEvents: MatchEvent[];
  liveStats: TwoTeamsStatistics | undefined;
  liveLineups: TeamsLineups | undefined;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
}

const MatchDetailsTabs = ({
  matchEvents,
  liveStats,
  liveLineups,
  homeTeamName,
  homeTeamLogo,
  awayTeamName,
  awayTeamLogo,
}: MatchDetailsTabsProps) => {
  const { t } = useTranslation();

  const hasEvents = matchEvents && matchEvents.length > 0;
  const hasStats = liveStats && liveStats.teamA && liveStats.teamB;
  const hasLineups = liveLineups && liveLineups.teamA && liveLineups.teamB;

  const availableTabs = [
    ...(hasEvents ? [{ id: "events", label: t("detailtabs.events") }] : []),
    ...(hasStats ? [{ id: "stats", label: t("detailtabs.stats") }] : []),
    ...(hasLineups ? [{ id: "lineups", label: t("detailtabs.lineups") }] : []),
  ];

  if (availableTabs.length === 0) return <NoData />;

  const [activeTab, setActiveTab] = useState(availableTabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    trackEvent(AnalyticsEvent.TAB_SWITCHED, { tab: tabId, context: "match_details" });
  };

  return (
    <div className="w-full bg-brand-card rounded-lg p-1 mt-8 ring-1 ring-gray-500">
       <div className="flex border-b border-brand-aqualight/30 overflow-hidden rounded-t-lg bg-brand-navbar">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-2 py-3 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "bg-brand-darkBg text-brand-cream border-b-2 border-brand-yellow"
                  : "text-brand-dona hover:text-brand-yellow"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeTab === "events" && hasEvents && (
          <div className="bg-brand-navbar">
            <MatchEventsTable
              events={matchEvents}
              homeTeamName={homeTeamName}
              homeTeamLogo={homeTeamLogo}
              awayTeamName={awayTeamName}
              awayTeamLogo={awayTeamLogo}
            />
          </div>
        )}

        {activeTab === "stats" && hasStats && (
          <div className="bg-brand-card p-4">
            <MatchStats statistics={liveStats} />
          </div>
        )}

        {activeTab === "lineups" && hasLineups && (
          <div className="bg-brand-card p-4">
            <MatchLineups lineups={liveLineups} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsTabs;
