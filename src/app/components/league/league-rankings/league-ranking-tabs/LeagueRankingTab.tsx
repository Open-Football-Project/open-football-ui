import { useState } from "react";
import { LeagueRankingPlayer } from "@matchinsights/core";
import NoData from "../../../general/no-data/NoData";
import LeagueRanking from "../LeagueRanking";
import { useTranslation } from "react-i18next";

interface LeagueRankingTabsProps {
  topScorers: LeagueRankingPlayer[];
  yellowCards: LeagueRankingPlayer[];
  redCards: LeagueRankingPlayer[];
  assists: LeagueRankingPlayer[];
}

const LeagueRankingTabs = ({
  topScorers,
  yellowCards,
  redCards,
  assists,
}: LeagueRankingTabsProps) => {
  const { t } = useTranslation();

  const hasTopScorers = topScorers.length > 0;
  const hasYellowCards = yellowCards.length > 0;
  const hasRedCard = redCards.length > 0;
  const hasAssists = assists.length > 0;

  const availableTabs = [
    ...(hasTopScorers
      ? [{ id: "scorers", label: t("common.top_scorers") }]
      : []),
    ...(hasYellowCards
      ? [{ id: "yCards", label: t("common.top_y_cards") }]
      : []),
    ...(hasRedCard ? [{ id: "rCards", label: t("common.top_r_cards") }] : []),
    ...(hasAssists ? [{ id: "assists", label: t("common.top_assists") }] : []),
  ];

  if (availableTabs.length === 0) return <NoData />;

  const [activeTab, setActiveTab] = useState(availableTabs[0].id);

  return (
    <div className="w-full bg-brand-card">
      <div className="flex w-full overflow-hidden rounded-t-lg bg-black/40 border-b border-brand-aqualight/30 mb-1">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-3 sm:px-4 sm:py-2 font-semibold text-sm sm:text-base transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "text-brand-cream bg-black/60 border-b-2 border-brand-yellow"
                  : "text-brand-lightGray hover:text-brand-yellow"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeTab === "scorers" && hasTopScorers && (
          <div className="bg-brand-card">
            <LeagueRanking players={topScorers} />
          </div>
        )}

        {activeTab === "yCards" && hasYellowCards && (
          <div className="bg-brand-card">
            <LeagueRanking players={yellowCards} />
          </div>
        )}

        {activeTab === "rCards" && hasRedCard && (
          <div className="bg-brand-card">
            <LeagueRanking players={redCards} />
          </div>
        )}

        {activeTab === "assists" && hasAssists && (
          <div className="bg-brand-card">
            <LeagueRanking players={assists} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueRankingTabs;
