/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { LiveMatches } from "./LiveMatches";
import {
  ApiService,
  LiveMatch,
  useChartableLiveLeague,
  useLiveMatchesStatus,
  useValueBets,
} from "@matchinsights/core";

import { MemoryRouter } from "react-router-dom";

vi.mock("../general/no-data/NoData", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="no-data">{message}</div>
  ),
}));

vi.mock("../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" alt="team-logo" src={src} />
  ),
}));

vi.mock("../general/match-button/MatchButton", () => ({
  default: ({ fixtureId }: { fixtureId: number }) => (
    <button data-testid="match-button">MatchButton-{fixtureId}</button>
  ),
}));

vi.mock("../match/match-details/value-bets/wrapper/BettingToolWrapper", () => ({
  default: () => <div data-testid="betting-tool-wrapper">BettingToolWrapper</div>,
}));

vi.mock("../polls/match-poll/MatchPollComponent", () => ({
  default: ({ fixtureId }: { fixtureId: number }) => (
    <div data-testid="match-poll">Poll for {fixtureId}</div>
  ),
}));

vi.mock("../match/match-detail-tabs/MatchDetailsTabs", () => ({
  default: () => <div data-testid="match-details-tabs">Match Details Tabs</div>,
}));

vi.mock("../match/live-indicators/MatchLiveIndicators", () => ({
  default: ({ homeTeamName, awayTeamName }: { homeTeamName: string; awayTeamName: string }) => (
    <div data-testid="match-live-indicators">
      {homeTeamName} vs {awayTeamName}
    </div>
  ),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual<typeof import("@matchinsights/core")>(
    "@matchinsights/core"
  );

  return {
    ...actual,
    useLiveMatchesStatus: vi.fn(),
    useValueBets: vi.fn(),
    useChartableLiveLeague: vi.fn(),
  };
});

const mockApiService = {
  chartsService: {
    fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
    fetchOddsFixtures: vi.fn().mockResolvedValue([]),
  },
  playerService: {
    fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
  },
} as unknown as ApiService;

const mockMatches: LiveMatch[] = [
  {
    id: 1,
    homeTeamName: "HomeTeam",
    awayTeamName: "AwayTeam",
    homeTeamLogo: "home.png",
    awayTeamLogo: "away.png",
    homeTeamScore: 1,
    awayTeamScore: 2,
    elapsedTime: 45,
    homeAwayForm: {
      homeForm: ["W", "D", "L"],
      awayForm: ["L", "W", "D"],
      isHomeHot: false,
      isHomeCold: false,
      isAwayHot: false,
      isAwayCold: false,
      isDisplayable: false,
    },
  } as LiveMatch,
];

describe("LiveMatches", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useValueBets as Mock).mockReturnValue({
      valueBets: { markets: [] },
      loadingValueBets: false,
      isValueBetsAvailable: false,
    });
    (useChartableLiveLeague as Mock).mockReturnValue({
      isChartableLiveLeague: true,
      loadingActiveLeagueIds: false,
    });
  });

  it("renders NoData when there are no matches", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 0,
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={[]} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("no-data")).toHaveTextContent(
      "No Live Matches Currently"
    );
  });

  it("renders a list of matches and betting tool when value bets are available", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: {},
      isStatsAvailable: false,
      matchStats: {},
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: {
        id: 1,
        homeTeamName: "HomeTeam",
        awayTeamName: "AwayTeam",
      },
    });

    (useValueBets as Mock).mockReturnValue({
      valueBets: { markets: [{ betName: "Match Winner", fairOdds: [], bookmakers: [] }] },
      loadingValueBets: false,
      isValueBetsAvailable: true,
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByText("HomeTeam")).toBeInTheDocument();
    expect(screen.getByText("AwayTeam")).toBeInTheDocument();
    expect(screen.getByText("1 - 2")).toBeInTheDocument();
    expect(screen.getByText("45'")).toBeInTheDocument();
    expect(screen.getByTestId("betting-tool-wrapper")).toBeInTheDocument();
  });

  it("renders MatchDetailsTabs when stats or events exist", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: true,
      matchLineups: {},
      isStatsAvailable: true,
      matchStats: {},
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: {
        id: 1,
        homeTeamName: "HomeTeam",
        awayTeamName: "AwayTeam",
        events: [{ id: 1, type: "goal" }],
      },
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-details-tabs")).toBeInTheDocument();
  });

  it("renders MatchLiveIndicators even when isStatsAvailable is false", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      isStatsAvailable: false,
      matchStats: undefined,
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 1, homeTeamName: "HomeTeam", awayTeamName: "AwayTeam" },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-live-indicators")).toBeInTheDocument();
    expect(screen.getByTestId("match-live-indicators")).toHaveTextContent("HomeTeam vs AwayTeam");
  });

  it("renders MatchLiveIndicators with team names when isStatsAvailable is true", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      isStatsAvailable: true,
      matchStats: { teamA: { statistics: [] }, teamB: { statistics: [] } },
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 1, homeTeamName: "HomeTeam", awayTeamName: "AwayTeam" },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-live-indicators")).toBeInTheDocument();
    expect(screen.getByTestId("match-live-indicators")).toHaveTextContent("HomeTeam vs AwayTeam");
  });

  it("keeps MatchLiveIndicators visible when isStatsAvailable temporarily becomes false (stale data)", () => {
    const statsData = { teamA: { statistics: [] }, teamB: { statistics: [] } };
    const baseStatus = {
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 1, homeTeamName: "HomeTeam", awayTeamName: "AwayTeam" },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    };

    (useLiveMatchesStatus as Mock).mockReturnValue({
      ...baseStatus,
      isStatsAvailable: true,
      matchStats: statsData,
    });

    const { rerender } = render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-live-indicators")).toBeInTheDocument();

    (useLiveMatchesStatus as Mock).mockReturnValue({
      ...baseStatus,
      isStatsAvailable: false,
      matchStats: undefined,
    });

    rerender(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-live-indicators")).toBeInTheDocument();
  });

  it("updates MatchLiveIndicators team names when the selected fixture changes", () => {
    const statsData = { teamA: { statistics: [] }, teamB: { statistics: [] } };

    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      isStatsAvailable: true,
      matchStats: statsData,
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 1, homeTeamName: "HomeTeam", awayTeamName: "AwayTeam" },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    const { rerender } = render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-live-indicators")).toHaveTextContent("HomeTeam vs AwayTeam");

    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 2,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      isStatsAvailable: false,
      matchStats: undefined,
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 2, homeTeamName: "NewHome", awayTeamName: "NewAway" },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    rerender(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-live-indicators")).toHaveTextContent("NewHome vs NewAway");
  });

  it("does not render MatchLiveIndicators when the selected match's league is not chartable", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      isStatsAvailable: false,
      matchStats: undefined,
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 1, homeTeamName: "HomeTeam", awayTeamName: "AwayTeam", leagueId: 9999 },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    (useChartableLiveLeague as Mock).mockReturnValue({
      isChartableLiveLeague: false,
      loadingActiveLeagueIds: false,
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId("match-live-indicators")).not.toBeInTheDocument();
  });

  it("passes the api service and the selected match's league id to useChartableLiveLeague", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: undefined,
      isStatsAvailable: false,
      matchStats: undefined,
      polls: [],
      isAvailablePollsOn: false,
      availablePolls: [],
      selectedMatch: { id: 1, homeTeamName: "HomeTeam", awayTeamName: "AwayTeam", leagueId: 39 },
      isOddsAvailable: false,
      loadingOdds: false,
      odds: [],
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(useChartableLiveLeague).toHaveBeenCalledWith(mockApiService, 39);
  });

  it("renders polls when availablePolls are on", () => {
    (useLiveMatchesStatus as Mock).mockReturnValue({
      totalMatches: 1,
      selectedMatchId: 1,
      setSelectedMatchId: vi.fn(),
      isLineupsAvailable: false,
      matchLineups: {},
      isStatsAvailable: false,
      matchStats: {},
      polls: [],
      isAvailablePollsOn: true,
      availablePolls: [{ pollKey: "poll1" }],
      selectedMatch: { id: 1 },
    });

    render(
      <MemoryRouter>
        <LiveMatches apiService={mockApiService} matches={mockMatches} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("match-poll")).toHaveTextContent("Poll for 1");
  });
});
