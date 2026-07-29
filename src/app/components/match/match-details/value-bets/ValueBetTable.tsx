import { ValueBetMarket } from "open-football-project-core";
import { useTranslation } from "react-i18next";

interface ValueBetTableProps {
  market: ValueBetMarket;
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

const ValueBetTable = ({ market }: ValueBetTableProps) => {
  const { t } = useTranslation();
  const outcomeLabels = market.fairOdds.map((f) => f.label);

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-brand-success">
      <table className="w-full text-xs sm:text-sm text-brand-white border-collapse">
        <thead>
          <tr className="bg-brand-success">
            <th className="text-left px-3 py-2 text-brand-gray font-semibold uppercase tracking-wide whitespace-nowrap">
              {t("odds.fair_odds", { defaultValue: "Fair Odds" })}
            </th>
            {market.fairOdds.map((fairOdd) => (
              <th key={fairOdd.label} className="px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-brand-darkBg/70 font-normal mb-0.5">
                  {t(`odds.${tKey(fairOdd.label)}`, { defaultValue: fairOdd.label })}
                </div>
                <div className="font-bold text-brand-darkBg">{fairOdd.odd.toFixed(2)}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {market.bookmakers.map((bookmaker, idx) => (
            <tr
              key={bookmaker.name}
              className={`border-t border-brand-darkBg hover:bg-brand-navbar transition ${
                idx % 2 === 0 ? "bg-brand-card" : "bg-brand-navbar"
              }`}
            >
              <td className="px-3 py-2 text-brand-white font-medium whitespace-nowrap">
                {bookmaker.name}
              </td>
              {outcomeLabels.map((label) => {
                const outcome = bookmaker.outcomes.find((o) => o.label === label);
                return (
                  <td key={label} className="px-3 py-2 text-center">
                    {outcome ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span
                          className={
                            outcome.isValue
                              ? "font-bold text-brand-red"
                              : "text-brand-lightGray"
                          }
                        >
                          {outcome.odd.toFixed(2)}
                        </span>
                        {outcome.isValue && (
                          <span className="text-[9px] font-bold bg-brand-yellow text-darkerText px-1.5 py-0.5 rounded-sm leading-tight">
                            {t("odds.value", { defaultValue: "VALUE" })}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValueBetTable;
