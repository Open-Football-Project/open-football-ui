import NoData from "../general/no-data/NoData";
import MatchPollComponent from "../polls/match-poll/MatchPollComponent";
import MatchDetailsTabs from "../match/match-detail-tabs/MatchDetailsTabs";
import {
  ApiService,
  LiveMatch,
  useChartableLiveLeague,
  useLiveMatchesStatus,
  useValueBets,
} from "open-football-project-core";
import BettingToolWrapper from "../match/match-details/value-bets/wrapper/BettingToolWrapper";
import MatchLiveIndicators from "../match/live-indicators/MatchLiveIndicators";
import { LiveMatchCard } from "./live-match-card/LiveMatchCard";


interface LiveMatchesProps {
  apiService: ApiService;
  matches: LiveMatch[];
  fixtureId?: number;
}

export const LiveMatches = ({
  apiService,
  matches,
  fixtureId,
}: LiveMatchesProps) => {
  const {
    totalMatches,
    selectedMatchId,
    setSelectedMatchId,
    isLineupsAvailable,
    matchLineups,
    isStatsAvailable,
    matchStats,
    polls,
    isAvailablePollsOn,
    availablePolls,
    selectedMatch,
  } = useLiveMatchesStatus(apiService, matches, fixtureId);

  const { valueBets, loadingValueBets, isValueBetsAvailable } = useValueBets(
    apiService,
    selectedMatchId ?? -1
  );

  const { isChartableLiveLeague } = useChartableLiveLeague(
    apiService,
    selectedMatch?.leagueId
  );

  if (totalMatches === 0) return <NoData message="No Live Matches Currently" />;

  return (
    <div className="w-full flex flex-col gap-6 text-white">
      <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 px-1 sm:px-2">
        {matches.map((match) =>
          <LiveMatchCard
            key={match.id}
            match={match}
            selectedMatchId={selectedMatchId}
            selectMatch={setSelectedMatchId}
            apiService={apiService}
          />
        )}
      </ul>

      {(isStatsAvailable ||
        (selectedMatch?.events?.length ?? 0) > 0 ||
        isLineupsAvailable) && (
          <MatchDetailsTabs
            liveStats={matchStats}
            matchEvents={selectedMatch?.events ?? []}
            homeTeamName={selectedMatch?.homeTeamName ?? ""}
            homeTeamLogo={selectedMatch?.homeTeamLogo ?? ""}
            awayTeamName={selectedMatch?.awayTeamName ?? ""}
            awayTeamLogo={selectedMatch?.awayTeamLogo ?? ""}
            liveLineups={matchLineups}
          />
        )}

      {isChartableLiveLeague && (
        <MatchLiveIndicators
          liveStats={matchStats}
          homeTeamName={selectedMatch?.homeTeamName ?? ""}
          awayTeamName={selectedMatch?.awayTeamName ?? ""}
        />
      )}


      {isAvailablePollsOn && (
        <div className="flex flex-col lg:flex-row bg-brand-card rounded-lg p-1 gap-2 ring-1 ring-gray-500">
          {availablePolls.map((it) => (
            <MatchPollComponent
              key={it.pollKey}
              fixtureId={Number(selectedMatchId)}
              apiService={apiService}
              availablePoll={it}
              polls={polls}
            />
          ))}
        </div>
      )}
      
      {isValueBetsAvailable && selectedMatchId && (
        <div className="bg-brand-card rounded-lg p-1 ring-1 ring-gray-500">
          <BettingToolWrapper data={valueBets} isLoading={loadingValueBets} />
        </div>
      )}

    </div>
  );
};
