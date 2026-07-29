import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MatchDetailsSecondRow } from "./MatchDetailsSecondRow";
import { ApiService } from "@matchinsights/core";

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    useLastFiveMatchesEvents: vi.fn(),
    useSeasonStats: vi.fn(),
  };
});

vi.mock("../../../general/team-stats/TeamStats", () => ({
  default: ({ title, statistics }: any) => (
    <div data-testid="team-stats">{title + " - " + statistics.length}</div>
  ),
}));

vi.mock("../match-details-slider/MatchDetailsSlider", () => ({
  default: ({ items }: { items: any[] }) => (
    <div data-testid="slider">
      {items.map((it, idx) => (
        <div key={idx} data-testid="slide">
          {it.title}
          {it.component}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../summaries/match-events/MatchEvents", () => ({
  default: ({ loading, events }: any) => (
    <div data-testid="match-events">
      {loading ? "Loading Events" : `Events: ${events?.id ?? "none"}`}
    </div>
  ),
}));

import { useSeasonStats, useLastFiveMatchesEvents } from "@matchinsights/core";

describe("MatchDetailsSecondRow", () => {
  const mockApiService = {} as ApiService;

  const baseProps = {
    apiService: mockApiService,
    homeTeamId: 1,
    homeTeam: "Team A",
    awayTeamId: 2,
    awayTeam: "Team B",
    leagueId: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders TeamStats when season stats available", async () => {
    (useLastFiveMatchesEvents as Mock).mockReturnValue({
      loadingHomeEvents: false,
      loadingAwayEvents: false,
      homeEventsSummary: { id: "home" },
      awayEventsSummary: { id: "away" },
      isHomeEventsAvailable: true,
      isAwayEventsAvailable: true,
    });

    (useSeasonStats as Mock).mockReturnValue({
      loadingSeasonStats: false,
      isSeasonStatsAvailable: true,
      seasonStats: {
        teamA: { teamName: "Team A", statistics: [] },
        teamB: { teamName: "Team B", statistics: [] },
      },
    });

    render(<MatchDetailsSecondRow {...baseProps} />);

    await waitFor(() => {
      expect(screen.getAllByTestId("team-stats")).toHaveLength(2);
    });

    expect(screen.queryByTestId("slider")).toBeNull();
  });

  it("renders slider when season stats NOT available", async () => {
    (useLastFiveMatchesEvents as Mock).mockReturnValue({
      loadingHomeEvents: false,
      loadingAwayEvents: false,
      homeEventsSummary: { id: "home" },
      awayEventsSummary: { id: "away" },
      isHomeEventsAvailable: true,
      isAwayEventsAvailable: true,
    });

    (useSeasonStats as Mock).mockReturnValue({
      loadingSeasonStats: false,
      isSeasonStatsAvailable: false,
      seasonStats: null,
    });

    render(<MatchDetailsSecondRow {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("slider")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("slide")).toHaveLength(2);
    expect(screen.getAllByTestId("match-events")[0]).toHaveTextContent("home");
  });

  it("filters unavailable slider items", async () => {
    (useLastFiveMatchesEvents as Mock).mockReturnValue({
      loadingHomeEvents: false,
      loadingAwayEvents: false,
      homeEventsSummary: { id: "home" },
      awayEventsSummary: null,
      isHomeEventsAvailable: true,
      isAwayEventsAvailable: false,
    });

    (useSeasonStats as Mock).mockReturnValue({
      loadingSeasonStats: false,
      isSeasonStatsAvailable: false,
      seasonStats: null,
    });

    render(<MatchDetailsSecondRow {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("slider")).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("slide")).toHaveLength(1);
  });

  it("renders nothing when loadingSeasonStats is true", async () => {
    (useLastFiveMatchesEvents as Mock).mockReturnValue({
      loadingHomeEvents: true,
      loadingAwayEvents: true,
      homeEventsSummary: null,
      awayEventsSummary: null,
      isHomeEventsAvailable: true,
      isAwayEventsAvailable: true,
    });

    (useSeasonStats as Mock).mockReturnValue({
      loadingSeasonStats: true,
      isSeasonStatsAvailable: false,
      seasonStats: null,
    });

    render(<MatchDetailsSecondRow {...baseProps} />);

    expect(screen.queryByTestId("team-stats")).toBeNull();
    expect(screen.queryByTestId("slider")).toBeNull();
    expect(screen.queryAllByTestId("match-events")).toHaveLength(0);
  });
});
