import { useTranslation } from "react-i18next";
import { FaSquareCheck, FaRegSquare } from "react-icons/fa6";
import { BetMarketInfo } from "@matchinsights/core";

interface OddsMarketMenuProps {
  markets: BetMarketInfo[];
  enabledMarketNames: string[];
  onToggleMarket: (marketName: string) => void;
  onClose: () => void;
}

const OddsMarketMenu = ({ markets, enabledMarketNames, onToggleMarket, onClose }: OddsMarketMenuProps) => {
  const { t } = useTranslation();

  return (
    <div
      data-testid="odds-market-menu"
      className="fixed top-0 right-0 w-64 max-w-[85vw] h-full bg-brand-navbar border-l border-white/20 shadow-2xl shadow-black z-50 flex flex-col"
    >
      <div className="p-4 flex justify-between items-center border-b border-white/20">
        <h2 className="text-base font-bold text-white">
          {t("charts.oddsMarketMenu.title", { defaultValue: "Markets" })}
        </h2>
        <button
          type="button"
          data-testid="odds-market-menu-close"
          aria-label={t("aria.oddsMarketMenu.close", { defaultValue: "Close odds markets menu" })}
          className="text-sm text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <ul className="flex flex-col px-4 pt-2 space-y-1 overflow-y-auto">
        {markets.map((market) => {
          const enabled = enabledMarketNames.includes(market.name);
          return (
            <li key={market.id}>
              <button
                type="button"
                data-testid={`odds-market-toggle-${market.name}`}
                aria-pressed={enabled}
                onClick={() => onToggleMarket(market.name)}
                className="w-full text-left bg-white/5 hover:bg-white/20 px-2 py-1.5 text-white text-xs flex items-center justify-between gap-2 rounded transition-colors duration-150"
              >
                <span>{t(`charts.markets.${market.name}`, { defaultValue: market.name })}</span>
                {enabled ? (
                  <FaSquareCheck className="text-brand-orange" />
                ) : (
                  <FaRegSquare className="text-brand-white" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OddsMarketMenu;
