import { useState } from "react";
import { trackEvent, AnalyticsEvent } from "../../../utils/analytics/analytics";
import PlayerTransfers from "../player-transfers/PlayerTransfers";
import PlayerTrophies from "../player-trophies/PlayerTrophies";
import { PlayerTransferInfo, PlayerTrophyInfo } from "@matchinsights/core";
import { useTranslation } from "react-i18next";

interface Props {
  transfers: PlayerTransferInfo[];
  trophies: PlayerTrophyInfo[];
}

export default function PlayerHistoryTabs({ transfers, trophies }: Props) {
  const [active, setActive] = useState<"transfers" | "trophies">("transfers");

  const handleTabChange = (tab: "transfers" | "trophies") => {
    setActive(tab);
    trackEvent(AnalyticsEvent.TAB_SWITCHED, { tab, context: "player_history" });
  };

  const { t } = useTranslation();
  return (
    <div className="bg-brand-card rounded-lg p-1 ring-1 ring-gray-500">
      <div className="flex border-b border-brand-darkBg">
        {["transfers", "trophies"].map((tab, index) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as "transfers" | "trophies")}
            className={`flex-1 py-3 text-sm uppercase font-semibold transition
              ${index === 0 ? "rounded-tl-lg" : "rounded-tr-lg"}
              ${
                active === tab
                  ? "bg-black/40 text-brand-cream"
                  : "text-brand-lightGray hover:text-brand-yellow"
              }`}
          >
            {t(`common.${tab}`)}
          </button>
        ))}
      </div>

      <div className="p-4">
        {active === "transfers" && <PlayerTransfers transfers={transfers} />}
        {active === "trophies" && <PlayerTrophies trophies={trophies} />}
      </div>
    </div>
  );
}
