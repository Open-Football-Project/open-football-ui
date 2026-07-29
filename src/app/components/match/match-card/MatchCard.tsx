import { forwardRef } from "react";
import {
  ApiService,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from "open-football-project-core";
import Logo from "../../general/logo/Logo";
import MatchButton from "../../general/match-button/MatchButton";
import StatusOrTime from "../../general/status-or-time/StatusOrTime";
import ChartButton from "../../general/chart-button/ChartButton";
import TopGuysButton from "../../general/top-guys-button/TopGuysButton";

export interface MatchCardMatch {
  fixtureId: number;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  isFinished: boolean;
  date: string;
  statusShort: string;
  isLiveNow: boolean;
}

interface MatchCardProps {
  match: MatchCardMatch;
  apiService: ApiService;
  className?: string;
  tabIndex?: number;
}

const MatchCard = forwardRef<HTMLAnchorElement, MatchCardProps>(
  ({ match, apiService, className, tabIndex }, ref) => {
    const { isCharteableMatchNow } = useCharteableMatchNow(
      apiService,
      match.fixtureId,
    );
    const { isTopGuysAvailable } = useTopGuysAvailable(
      apiService,
      match.fixtureId,
    );

    return (
      <li className="bg-brand-darkBg rounded-lg p-2 w-full flex flex-col gap-1 hover:shadow-lg transition">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center justify-center text-brand-yellow shrink-0">
            <StatusOrTime
              isFinished={match.isFinished}
              statusShort={match.statusShort}
              utcDate={match.date}
            />
          </div>

          <div className="flex items-center justify-center gap-1 sm:gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end min-w-0">
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-brand-white truncate">
                {match.homeTeamName}
              </span>
              <Logo
                src={match.homeTeamLogo ?? undefined}
                customImageClass="w-3 h-3 sm:w-5 sm:h-5 shrink-0"
                name={match.homeTeamName}
              />
            </div>

            <span className="text-[9px] sm:text-sm text-brand-yellow font-bold px-1 shrink-0 min-w-[36px] text-center">
              {match.isFinished
                ? `${match.homeTeamScore} - ${match.awayTeamScore}`
                : "-"}
            </span>

            <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-start min-w-0">
              <Logo
                src={match.awayTeamLogo ?? undefined}
                customImageClass="w-3 h-3 sm:w-5 sm:h-5 shrink-0"
                name={match.awayTeamName}
              />
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-brand-white truncate">
                {match.awayTeamName}
              </span>
            </div>
          </div>

          <div className="flex items-center shrink-0 w-[60px] justify-center">
            <MatchButton
              ref={ref}
              tabIndex={tabIndex}
              className={className}
              isLiveNow={match.isLiveNow}
              fixtureId={match.fixtureId}
            />
          </div>
        </div>

        {(isCharteableMatchNow || isTopGuysAvailable) && (
          <div className="flex items-center justify-center gap-2">
            {isCharteableMatchNow && (
              <ChartButton fixtureId={match.fixtureId} />
            )}
            {isTopGuysAvailable && (
              <TopGuysButton fixtureId={match.fixtureId} />
            )}
          </div>
        )}
      </li>
    );
  },
);

MatchCard.displayName = "MatchCard";

export default MatchCard;
