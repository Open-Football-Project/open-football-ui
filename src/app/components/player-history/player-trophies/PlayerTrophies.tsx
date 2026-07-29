import NoData from "../../general/no-data/NoData";
import { useTranslation } from "react-i18next";

import {
  translateCountry,
  translateLeague,
  PlayerTrophyInfo,
} from "open-football-project-core";

interface PlayerTrophiesProps {
  trophies: PlayerTrophyInfo[];
}

export default function PlayerTrophies({ trophies }: PlayerTrophiesProps) {
  const { t } = useTranslation();

  const validTrophies = trophies.filter(
    (trophy) => trophy.league && trophy.season && trophy.place
  );

  if (!validTrophies.length) return <NoData />;

  const orderedTrophies = [...validTrophies].sort((a, b) => {
    if (!a.season) return 1;
    if (!b.season) return -1;
    return b.season.localeCompare(a.season);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {orderedTrophies.map((trophy, idx) => (
        <div
          key={`trophy-${idx}`}
          className="bg-brand-darkBg rounded-lg p-4 border border-brand-darkBg hover:border-brand-yellow transition"
        >
          <p className="text-sm font-bold uppercase text-brand-yellow">
            {translateLeague(trophy.league!, t)}
          </p>

          {trophy.place && (
            <p className="mt-1 text-xs font-semibold text-brand-orange uppercase">
              {trophy.place}
            </p>
          )}

          {trophy.season && (
            <p className="text-xs text-brand-white mt-1">{trophy.season}</p>
          )}

          {trophy.country && (
            <p className="text-xs text-brand-lightGray mt-2">
              {translateCountry(trophy.country, t)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
