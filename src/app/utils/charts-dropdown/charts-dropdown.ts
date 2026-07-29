import {
  FixtureChartsResponse,
  LiveChartableMatch,
} from "open-football-project-core";

const STALE_MINUTES = 15;
const LIVE_MARKER = "🔴";

interface TimedPoint {
  capturedAt: string;
}

interface DropdownOption {
  id: string;
  value: string;
}

const flattenIndicators = (match: FixtureChartsResponse): TimedPoint[] =>
  Object.values(match.indicators ?? {}).flat();


const isLatestPointLive = (points: TimedPoint[], now: Date): boolean => {
  if (points.length === 0) return false;

  const latest = points.reduce((a, b) =>
    new Date(b.capturedAt).getTime() > new Date(a.capturedAt).getTime() ? b : a,
  );

  const ageMinutes = (now.getTime() - new Date(latest.capturedAt).getTime()) / 60000;
  return ageMinutes <= STALE_MINUTES;
};

const liveLabel = (homeTeamName: string, awayTeamName: string, isLive: boolean): string => {
  const label = `${homeTeamName} vs ${awayTeamName}`;
  return isLive ? `${LIVE_MARKER} ${label}` : label;
};

export const getLiveFixturesIdsSet = (chartMatches: FixtureChartsResponse[], now: Date) =>
  new Set(
    chartMatches
      .filter((match) => isLatestPointLive(flattenIndicators(match), now))
      .map((match) => match.fixtureId),
  );

export const solveIndicatorMatchesDropList = (
  liveFixtureIds: Set<number>,
  matches: FixtureChartsResponse[],
): DropdownOption[] =>
  matches.map((match) => ({
    id: String(match.fixtureId),
    value: liveLabel(match.homeTeamName, match.awayTeamName, liveFixtureIds.has(match.fixtureId)),
  }));

export const solveOddsMatchesDropList = (
  liveFixtureIds: Set<number>,
  oddsMatches: LiveChartableMatch[],
): DropdownOption[] =>
  oddsMatches.map((match) => ({
    id: String(match.fixtureId),
    value: liveLabel(match.homeTeamName, match.awayTeamName, liveFixtureIds.has(match.fixtureId)),
  }));
