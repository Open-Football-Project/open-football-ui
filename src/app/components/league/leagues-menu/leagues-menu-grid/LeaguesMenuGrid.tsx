import { Link } from "react-router-dom";
import { LeagueBasicInfo } from "@matchinsights/core";
import Logo from "../../../../components/general/logo/Logo";
import { useTranslation } from "react-i18next";
import { leagueTranslationKey, cleanLeagueName } from "@matchinsights/core";
import {
  trackEvent,
  AnalyticsEvent,
} from "../../../../utils/analytics/analytics";

interface LeaguesMenuGridProps {
  leagues: LeagueBasicInfo[];
}

export const LeaguesMenuGrid = ({ leagues }: LeaguesMenuGridProps) => {
  const { t } = useTranslation();

  return (
    <ul
      aria-label={t("aria.leaguesMenu.leagues")}
      className={`grid gap-4 grid-cols-1 md:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] lg:[grid-template-columns:repeat(5,minmax(0,1fr))]`}
    >
      {leagues.map((item, i) => (
        <li
          data-testid={item.id}
          key={`${item.id}-${i}`}
          className="p-1 outline-none"
        >
          <Link
            onClick={() =>
              trackEvent(AnalyticsEvent.LEAGUE_OPENED, {
                league_id: String(item.id),
              })
            }
            to={`/league/${item.id}`}
            className="group bg-brand-card rounded-lg p-2 flex items-center gap-2 cursor-pointer ring-1 ring-gray-500 hover:ring-2 hover:ring-brand-aqua hover:bg-brand-grayint hover:text-brand-yellow"
          >
            <Logo src={item.logo} customImageClass="w-5 h-5" name={item.name} />
            <span
              className={`font-semibold text-brand-white uppercase text-xs group-hover:text-brand-yellow truncate`}
            >
              {cleanLeagueName(
                t(`league.${leagueTranslationKey(item.name)}`, {
                  defaultValue: item.name,
                })
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
