import { useTranslation } from "react-i18next";
import { TeamPlayer } from "@matchinsights/core";
import { PlayerCard } from "./player/PlayerCard";
import { Link } from "react-router-dom";

interface TeamSquadProps {
  players: TeamPlayer[];
  teamName?: string;
  teamLogo?: string;
}

export const TeamSquad = ({ players, teamName, teamLogo }: TeamSquadProps) => {
  const { t } = useTranslation();
  return (
    <div className="w-full p-2">
      <h2 className="py-2 px-4 mb-4 text-center font-semibold bg-black/40 text-brand-cream rounded-t-lg">
        {t("common.squad")}
      </h2>
      <div className="grid w-full grid-cols-1 gap-4 p-1 md:grid-cols-2 lg:grid-cols-4">
        {players.map((player, idx) => (
          <div key={idx} className="w-full">
            <Link
              to={`/player/${player.playerId}`}
              aria-label={`${player.name} player history`}
              className="block"
            >
              <PlayerCard key={idx} player={player} teamName={teamName} teamLogo={teamLogo} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
