import {
  ApiService,
  useLastFiveResults,
  useTeamsScorePerformance,
  useRestStatus,
  useOddsFeeling,
  useHeadToHead,
  h2hToIndicator,
} from "@matchinsights/core";

import { TopLeftSlide } from "./left-slide/TopLeftSlide";
import { TopRightSlide } from "./right-slide/TopRightSlide";

import MatchDetailsSlider, {
  SliderItem,
} from "../match-details-slider/MatchDetailsSlider";

interface MatchIndicatorProps {
  apiService: ApiService;
  homeTeamId: number;
  homeTeam: string;
  awayTeamId: number;
  awayTeam: string;
  leagueId: number;
  fixtureDate: string;
  matchId: number;
}

export const MatchIndicators = ({
  apiService,
  homeTeamId,
  homeTeam,
  awayTeamId,
  awayTeam,
  leagueId,
  fixtureDate,
  matchId,
}: MatchIndicatorProps) => {
  const {
    lastFiveResults,
    loadingLastFiveResults,
    isLastFiveResultsAvailable,
  } = useLastFiveResults(apiService, homeTeamId, awayTeamId);
  const { loadingTeamsPerformance, teamsPerformance, isPerformanceAvailable } =
    useTeamsScorePerformance(apiService, homeTeamId, awayTeamId, leagueId);

  const { loadingRestStatus, restStatus, isRestStatusAvailable } =
    useRestStatus(apiService, homeTeamId, awayTeamId, fixtureDate);

  const { loadingOddsFeeling, oddsFeeling, isOddsFeelingAvailable } =
    useOddsFeeling(apiService, matchId);

  const { loadingH2hDetail, h2hDetails, isHead2HeadAvailable } =
    useHeadToHead(apiService, homeTeamId, awayTeamId);

  const sliding: SliderItem[] = [
    {
      isLoading:
        loadingLastFiveResults || loadingTeamsPerformance || loadingRestStatus,
      component: (
        <TopLeftSlide
          lastFiveResults={lastFiveResults}
          lastFiveLoading={loadingLastFiveResults}
          isLastFiveAvailable={isLastFiveResultsAvailable}
          performance={teamsPerformance}
          loadingPerformance={loadingTeamsPerformance}
          isPerformanceAvailable={isPerformanceAvailable}
          restStatus={restStatus}
          loadingRestStatus={loadingRestStatus}
          isRestStatusAvailable={isRestStatusAvailable}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
        />
      ),
    },
    {
      isLoading: loadingOddsFeeling || loadingH2hDetail,
      component: (
        <TopRightSlide
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          oddsFeeling={oddsFeeling}
          loadingOddsFeeling={loadingOddsFeeling}
          isOddsFeelingAvailable={isOddsFeelingAvailable}
          h2hIndicator={h2hToIndicator(h2hDetails, homeTeam, awayTeam)}
          isH2HAvailable={isHead2HeadAvailable}
        />
      ),
    },
  ];
  return (
    <MatchDetailsSlider
      key={`top-row-slider-${homeTeamId}-${awayTeamId}`}
      items={sliding.filter((i) => i.isLoading === false)}
    />
  );
};
