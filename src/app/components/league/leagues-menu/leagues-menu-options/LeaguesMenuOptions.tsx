import { useTranslation } from "react-i18next";
import { LeagueMenuSelectionOption } from "../LeaguesMenu";

interface LeaguesMenuOptionsProps {
  items: LeagueMenuSelectionOption[];
  selectItem: (item: LeagueMenuSelectionOption) => void;
}

export const LeaguesMenuOptions = ({
  items,
  selectItem,
}: LeaguesMenuOptionsProps) => {
  const { t } = useTranslation();
  return (
    <ul
      aria-label={t("aria.leaguesMenu.countries")}
      className={`grid gap-4 grid-cols-1 md:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] lg:[grid-template-columns:repeat(5,minmax(0,1fr))]`}
    >
      {items.map((item, id) => (
        <li
          data-testid={`${item.country}-${id}`}
          key={`${item.country}-${id}`}
          className="p-1 outline-none"
        >
          <button
            onClick={() => selectItem(item)}
            className="group bg-brand-card ring-1 ring-gray-500 focus:ring-2 focus:ring-brand-orange hover:bg-brand-grayint rounded-lg p-2 flex justify-between items-center cursor-pointer w-full"
            tabIndex={0}
          >
            <span
              className={`font-semibold text-brand-white uppercase ${
                item.country.length > 18 ? "text-[13px]" : "text-xs"
              } group-hover:text-brand-yellow`}
            >
              {t(`country.${item.country.toLowerCase()}`, {
                defaultValue: item.country,
              })}
            </span>
            <span className="ml-auto text-xs text-brand-white group-hover:text-brand-yellow">
              ▶
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
};
