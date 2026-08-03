import {
  ApiService,
  LiveMatch,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from "open-football-project-core";
import Logo from "../../general/logo/Logo";
import MatchButton from "../../general/match-button/MatchButton";
import ChartButton from "../../general/chart-button/ChartButton";
import TopGuysButton from "../../general/top-guys-button/TopGuysButton";

interface LiveMatchCardProps {
  match: LiveMatch;
  selectedMatchId: number | null;
  selectMatch: (matchId: number) => void;
  apiService: ApiService;
}

export const LiveMatchCard = ({ match, selectedMatchId, selectMatch, apiService }: LiveMatchCardProps) => {
  const { isCharteableMatchNow } = useCharteableMatchNow(apiService, match.id);
  const { isTopGuysAvailable } = useTopGuysAvailable(apiService, match.id);
  const isSelected = selectedMatchId === match.id;
  const cardBg = isSelected
    ? "bg-brand-greena text-xs text-white rounded-lg ring-1 ring-brand-blueo"
    : "bg-brand-card hover:bg-brand-royalblue_hover hover:text-white rounded-lg";

  return (
    <li
      key={match.id}
      onClick={() => selectMatch(match.id)}
      className={`p-3 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] flex flex-col gap-1 ${cardBg}`}
    >
      <div className="flex justify-end">
        <span
          className={`text-[10px] sm:text-xs font-bold ${isSelected ? "text-brand-white" : "text-brand-yellow"}`}
        >
          {match.elapsedTime ? `${Math.floor(match.elapsedTime)}'` : "-"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-[1.1] justify-end truncate">
            <span className="text-[9px] sm:text-[11px] uppercase font-semibold truncate">
              {match.homeTeamName}
            </span>
            <Logo src={match.homeTeamLogo} customImageClass="w-3 h-3 sm:w-5 sm:h-5" name={match.homeTeamName} />
          </div>

          <div className="text-xs sm:text-sm font-bold min-w-[30px] text-center">
            {match.homeTeamScore} - {match.awayTeamScore}
          </div>

          <div className="flex items-center gap-1 flex-1 justify-start truncate">
            <Logo src={match.awayTeamLogo} customImageClass="w-3 h-3 sm:w-5 sm:h-5" name={match.awayTeamName} />
            <span className="text-[9px] sm:text-[11px] uppercase font-semibold truncate">
              {match.awayTeamName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        {isCharteableMatchNow && <ChartButton fixtureId={match.id} />}
        {isTopGuysAvailable && <TopGuysButton fixtureId={match.id} />}
        <MatchButton isLiveNow={false} fixtureId={match.id} />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 overflow-hidden rounded-b-lg">
        <div className="w-[200%] h-full bg-gradient-to-r from-brand-aqua via-brand-royalblue to-brand-aqualight animate-slide" />
      </div>
    </li>
  );
};
