import { describe, it, expect } from "vitest";
import { FixtureChartsResponse, LiveChartableMatch } from "open-football-project-core";
import {
  getLiveFixturesIdsSet,
  solveIndicatorMatchesDropList,
  solveOddsMatchesDropList,
} from "./charts-dropdown";

const now = new Date("2026-07-04T03:30:00Z");
const FRESH = "2026-07-04T03:20:00Z"; // 10 minutes before `now`
const STALE = "2026-07-04T03:00:00Z"; // 30 minutes before `now`

describe("getLiveFixturesIdsSet", () => {
  it("returns an empty set for an empty chartMatches", () => {
    expect(getLiveFixturesIdsSet([], now)).toEqual(new Set());
  });

  it("includes a fixture whose latest indicator point was captured recently", () => {
    const chartMatches: FixtureChartsResponse[] = [
      {
        fixtureId: 201,
        homeTeamName: "Real Madrid",
        awayTeamName: "Barcelona",
        indicators: { momentum: [{ minute: 60, value: 10, capturedAt: FRESH }] },
      },
    ];

    expect(getLiveFixturesIdsSet(chartMatches, now)).toEqual(new Set([201]));
  });

  it("excludes a fixture whose latest indicator point is stale", () => {
    const chartMatches: FixtureChartsResponse[] = [
      {
        fixtureId: 202,
        homeTeamName: "Bayern",
        awayTeamName: "Dortmund",
        indicators: { momentum: [{ minute: 80, value: 10, capturedAt: STALE }] },
      },
    ];

    expect(getLiveFixturesIdsSet(chartMatches, now)).toEqual(new Set());
  });

  it("picks the latest point across every indicator series, not just one", () => {
    const chartMatches: FixtureChartsResponse[] = [
      {
        fixtureId: 203,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        indicators: {
          momentum: [{ minute: 10, value: 0, capturedAt: STALE }],
          control: [{ minute: 60, value: 50, capturedAt: FRESH }],
        },
      },
    ];

    expect(getLiveFixturesIdsSet(chartMatches, now)).toEqual(new Set([203]));
  });

  it("excludes a fixture with no indicator points at all", () => {
    const chartMatches: FixtureChartsResponse[] = [
      {
        fixtureId: 204,
        homeTeamName: "Inter",
        awayTeamName: "Milan",
        indicators: {},
      },
    ];

    expect(getLiveFixturesIdsSet(chartMatches, now)).toEqual(new Set());
  });
});

describe("solveIndicatorMatchesDropList", () => {
  it("returns an empty list for an empty matches list", () => {
    expect(solveIndicatorMatchesDropList(new Set(), [])).toEqual([]);
  });

  it("marks a match live when its fixtureId is in the live set", () => {
    const chartMatches: FixtureChartsResponse[] = [
      {
        fixtureId: 201,
        homeTeamName: "Real Madrid",
        awayTeamName: "Barcelona",
        indicators: {},
      },
    ];

    const result = solveIndicatorMatchesDropList(new Set([201]), chartMatches);

    expect(result).toEqual([{ id: "201", value: "🔴 Real Madrid vs Barcelona" }]);
  });

  it("does not mark a match live when its fixtureId is absent from the live set", () => {
    const chartMatches: FixtureChartsResponse[] = [
      {
        fixtureId: 202,
        homeTeamName: "Bayern",
        awayTeamName: "Dortmund",
        indicators: {},
      },
    ];

    const result = solveIndicatorMatchesDropList(new Set(), chartMatches);

    expect(result).toEqual([{ id: "202", value: "Bayern vs Dortmund" }]);
  });
});

describe("solveOddsMatchesDropList", () => {
  it("returns an empty list for an empty oddsMatches", () => {
    expect(solveOddsMatchesDropList(new Set(), [])).toEqual([]);
  });

  it("marks matches live by fixtureId lookup into the live set", () => {
    const oddsMatches: LiveChartableMatch[] = [
      { fixtureId: 101, homeTeamName: "Arsenal", awayTeamName: "Chelsea" },
      { fixtureId: 102, homeTeamName: "Man City", awayTeamName: "Liverpool" },
    ];

    const result = solveOddsMatchesDropList(new Set([101]), oddsMatches);

    expect(result).toEqual([
      { id: "101", value: "🔴 Arsenal vs Chelsea" },
      { id: "102", value: "Man City vs Liverpool" },
    ]);
  });
});
