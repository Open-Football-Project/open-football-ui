import { useTranslation } from "react-i18next";
import { MarketOddsReason, SeasonFormReason, TodayPlayerScore, translatePlayerPosition } from "@matchinsights/core";

import profile from "../../../assets/images/player.png";

interface TodayPlayerCardProps {
  playerScore: TodayPlayerScore;
  teamName: string;
}

const tKey = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[\d.+\-:,]+/g, " ")
    .replace(/\//g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s/g, "_");

const TodayPlayerCard = ({ playerScore, teamName }: TodayPlayerCardProps) => {
  const { t } = useTranslation();
  const { player, score, signal, reason } = playerScore;

  const MAX_MARKETS_SHOWN = 2;

  const oddsReasonItems = (marketOdds: MarketOddsReason) => {
    const probabilityItem = (
      <>
        {t("todayplayers.avg_implied_probability", { defaultValue: "Avg. implied probability" })}:{" "}
        <span className="font-semibold text-brand-aqualight">{Math.round(score * 100)}%</span>
      </>
    );

    const { markets } = marketOdds;
    const hiddenCount = markets.length - MAX_MARKETS_SHOWN;
    const marketItems =
      hiddenCount > 1
        ? [
            ...markets
              .slice(0, MAX_MARKETS_SHOWN)
              .map((market) => t(`todayplayers.markets.${tKey(market)}`, { defaultValue: market })),
            t("todayplayers.more_markets", { defaultValue: `+${hiddenCount} more`, count: hiddenCount }),
          ]
        : markets.map((market) => t(`todayplayers.markets.${tKey(market)}`, { defaultValue: market }));

    return [probabilityItem, ...marketItems];
  };

  const seasonFormReasonItems = (seasonForm: SeasonFormReason) => [
    <>
      {t("common.appearences", { defaultValue: "Appearences" })}:{" "}
      <span className="font-semibold text-brand-yellow">{seasonForm.appearances}</span>
    </>,
    <>
      {t("common.goals", { defaultValue: "Goals" })}:{" "}
      <span className="font-semibold text-brand-yellow">{seasonForm.goals}</span>
    </>,
    <>
      {t("common.assists", { defaultValue: "Assists" })}:{" "}
      <span className="font-semibold text-brand-yellow">{seasonForm.assists}</span>
    </>,
    <>
      {t("common.rating", { defaultValue: "Rating" })}:{" "}
      <span className="font-semibold text-brand-yellow">{seasonForm.rating.toFixed(1)}</span>
    </>,
  ];

  const isOddsImplied = signal === "ODDS_IMPLIED";
  const signalLabel = isOddsImplied
    ? t("todayplayers.signal_odds", { defaultValue: "Odds" })
    : t("todayplayers.signal_season_stat", { defaultValue: "Season Form" });
  const reasonItems = isOddsImplied
    ? oddsReasonItems(reason as MarketOddsReason)
    : seasonFormReasonItems(reason as SeasonFormReason);

  return (
    <div className="w-full bg-brand-darkBg rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <div className="flex flex-col items-center flex-shrink-0 sm:w-24 text-center">
        <img
          src={player.photo || profile}
          alt={player.name}
          className="h-20 w-20 object-contain rounded-lg"
        />
        <p className="mt-2 text-xs font-semibold uppercase leading-5 text-brand-yellow">
          {player.name}
        </p>
        {player.position && (
          <p data-testid="today-player-position" className="text-xs font-medium text-brand-white">
            {translatePlayerPosition(player.position, t)}
          </p>
        )}
      </div>
      <div className="w-full flex-1 min-h-[9.5rem] text-center sm:text-left">
        <p className="text-sm font-semibold text-brand-white">{teamName}</p>
        <span
          data-testid="today-player-signal"
          className={`mt-2 inline-block text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
            isOddsImplied ? "bg-brand-orange text-white" : "bg-brand-card text-brand-aqualight"
          }`}
        >
          {signalLabel}
        </span>
        {isOddsImplied && (
          <p
            data-testid="today-player-markets-label"
            className="mt-2 text-[11px] font-semibold text-brand-white"
          >
            {t("todayplayers.markets_used_label", { defaultValue: "Matching Markets?" })}
          </p>
        )}
        <ul className="mt-2 text-[11px] text-brand-white list-disc list-inside text-center sm:text-left space-y-0.5">
          {reasonItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodayPlayerCard;
