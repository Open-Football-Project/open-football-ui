import { PlayerPosition, TodayPlayerScore } from "open-football-project-core";

import TodayPlayersSlider from "../today-players-slider/TodayPlayersSlider";

interface TodayPlayersPositionRowProps {
  position: PlayerPosition;
  homePlayerScores: TodayPlayerScore[];
  awayPlayerScores: TodayPlayerScore[];
  homeTeamName: string;
  awayTeamName: string;
}

const TodayPlayersPositionRow = ({
  homePlayerScores,
  awayPlayerScores,
  homeTeamName,
  awayTeamName,
}: TodayPlayersPositionRowProps) => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {homePlayerScores.length > 0 && (
        <TodayPlayersSlider playerScores={homePlayerScores} teamName={homeTeamName} />
      )}
      {awayPlayerScores.length > 0 && (
        <TodayPlayersSlider playerScores={awayPlayerScores} teamName={awayTeamName} />
      )}
    </div>
  );
};

export default TodayPlayersPositionRow;
