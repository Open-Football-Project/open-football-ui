import { useState } from "react";
import { ValueBetsResponse, ValueBetMarket } from "@matchinsights/core";
import { useTranslation } from "react-i18next";
import { trackEvent, AnalyticsEvent } from "../../../../../utils/analytics/analytics";
import ValueBetTable from "../ValueBetTable";

const tKey = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[\d.+\-:,]+/g, " ")
    .replace(/\//g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "_");

interface BettingToolWrapperProps {
  data: ValueBetsResponse;
  isLoading: boolean;
}

const BettingToolWrapper = ({ data, isLoading }: BettingToolWrapperProps) => {
  const { t } = useTranslation();
  const [selectedMarket, setSelectedMarket] = useState<ValueBetMarket>(
    data.markets[0]
  );

  if (isLoading) {
    return (
      <div className="w-full bg-brand-navbar animate-pulse h-40 rounded" />
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full overflow-x-auto rounded-t-lg bg-black/40 border-b border-brand-aqualight/30 mb-1">
        {data.markets.map((market) => (
          <button
            key={market.betName}
            onClick={() => { trackEvent(AnalyticsEvent.VALUE_BET_MARKET, { market: market.betName }); setSelectedMarket(market); }}
            className={`shrink-0 whitespace-nowrap text-xs sm:text-sm px-3 py-2 font-semibold tracking-wide transition hover:text-brand-yellow ${
              selectedMarket.betName === market.betName
                ? "bg-brand-darkBg text-brand-cream"
                : "bg-brand-navbar text-brand-dona hover:bg-brand-darkBg"
            }`}
          >
            {t(`odds.${tKey(market.betName)}`, { defaultValue: market.betName })}
          </button>
        ))}
      </div>

      <ValueBetTable market={selectedMarket} />

      <p className="text-[10px] text-brand-white opacity-50 text-right px-1 pt-1">
        {t("odds.gamble_aware", { defaultValue: "+18 | Gamble Aware" })}
      </p>
    </div>
  );
};

export default BettingToolWrapper;
