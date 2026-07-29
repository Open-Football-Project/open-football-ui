import { Bet } from "open-football-project-core";
import { useTranslation } from "react-i18next";
import MatchDetailsSlider, {
  SliderItem,
} from "../match-details-slider/MatchDetailsSlider";

interface MatchOddsProps {
  bets: Bet[];
  isLoading: boolean;
}

const MatchOdds = ({ isLoading, bets }: MatchOddsProps) => {
  const tKey = (text: string): string => {
    return text
      .trim()
      .toLowerCase()
      .replace(/[\d.+\-:,]+/g, " ")
      .replace(/\//g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\s/g, "_");
  };

  const { t } = useTranslation();

  const sliding: SliderItem[] = bets.map((it) => ({
    isLoading: isLoading,
    title: t(`odds.${tKey(it.betName)}`, { defaultValue: it.betName }),
    component: (
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full px-8 sm:px-12">
        {it.values.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center bg-brand-navbar border border-brand-royalblue px-4 sm:py-2 py-1 hover:bg-brand-darkBg transition"
          >
            <span className="text-[10px] sm:text-xs text-brand-white uppercase tracking-wide">
              {t(`odds.${tKey(item.label)}`, { defaultValue: item.label })}
            </span>
            <span className="text-[12px] sm:text-sm font-extrabold text-brand-success mt-2">
              {item.odd}
            </span>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <MatchDetailsSlider
      key={`odds-row-slider`}
      items={sliding.filter((it) => !it.isLoading)}
    />
  );
};

export default MatchOdds;
