import { LeagueRankingPlayer } from "open-football-project-core";
import RankingPlayerCard from "./rankin-player-card/RankingPlayerCard";

interface LeagueRankingProps {
  players: LeagueRankingPlayer[];
}

const LeagueRanking = ({ players }: LeagueRankingProps) => {
  return (
    <div className="w-full p-4">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {players.map((player, idx) => (
          <RankingPlayerCard key={idx} player={player} />
        ))}
      </div>
    </div>
  );
};

export default LeagueRanking;
