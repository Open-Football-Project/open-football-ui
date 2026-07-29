import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { MatchIndicators } from "./MatchIndicators";

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useOddsFeeling: vi.fn(),
    useTeamLeaguesStats: vi.fn(),
    useRestStatus: vi.fn(),
    useTeamsScorePerformance: vi.fn(),
    useLastFiveResults: vi.fn(),
    useHeadToHead: vi.fn(),
  };
});

vi.mock("./left-slide/TopLeftSlide", () => ({
  TopLeftSlide: vi.fn(() => <div data-testid="top-left-slide" />),
}));
vi.mock("./right-slide/TopRightSlide", () => ({
  TopRightSlide: vi.fn(() => <div data-testid="top-right-slide" />),
}));
vi.mock("../match-details-slider/MatchDetailsSlider", () => ({
  default: vi.fn(({ items }) => (
    <div data-testid="match-details-slider">
      {items.map((i: any, idx: number) => (
        <div key={idx} data-testid={`slide-${idx}`}>
          {i.component}
        </div>
      ))}
    </div>
  )),
}));

import {
  useOddsFeeling,
  useLastFiveResults,
  useTeamsScorePerformance,
  useRestStatus,
  useTeamLeaguesStats,
  useHeadToHead,
} from "open-football-project-core";
import { TopRightSlide } from "./right-slide/TopRightSlide";

describe("MatchDetailsTopRow", () => {
  const baseProps = {
    apiService: {} as any,
    homeTeamId: 1,
    awayTeamId: 2,
    homeTeam: "Arsenal",
    awayTeam: "Chelsea",
    leagueId: 10,
    fixtureDate: "2025-10-06",
    matchId: 123,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useHeadToHead as any).mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: false,
      isHead2HeadAvailable: false,
    });
  });

  it("renders both slides when all data loaded", () => {
    (useLastFiveResults as any).mockReturnValue({
      lastFiveResults: {},
      loadingLastFiveResults: false,
    });
    (useTeamsScorePerformance as any).mockReturnValue({
      teamsPerformance: {},
      loadingTeamsPerformance: false,
    });
    (useRestStatus as any).mockReturnValue({
      restStatus: {},
      loadingRestStatus: false,
    });
    (useTeamLeaguesStats as any).mockReturnValue({
      ranksAndPoints: {},
      loadingRanksAndPoints: false,
    });
    (useOddsFeeling as any).mockReturnValue({
      oddsFeeling: {},
      loadingOddsFeeling: false,
    });

    render(<MatchIndicators {...baseProps} />);

    expect(screen.getByTestId("match-details-slider")).toBeInTheDocument();
    expect(screen.getByTestId("top-left-slide")).toBeInTheDocument();
    expect(screen.getByTestId("top-right-slide")).toBeInTheDocument();
  });

  it("filters out loading slides", () => {
    (useLastFiveResults as any).mockReturnValue({
      lastFiveResults: undefined,
      loadingLastFiveResults: true,
    });
    (useTeamsScorePerformance as any).mockReturnValue({
      teamsPerformance: {},
      loadingTeamsPerformance: false,
    });
    (useRestStatus as any).mockReturnValue({
      restStatus: {},
      loadingRestStatus: false,
    });
    (useTeamLeaguesStats as any).mockReturnValue({
      ranksAndPoints: {},
      loadingRanksAndPoints: false,
    });
    (useOddsFeeling as any).mockReturnValue({
      oddsFeeling: {},
      loadingOddsFeeling: false,
    });

    render(<MatchIndicators {...baseProps} />);

    expect(screen.queryByTestId("top-left-slide")).not.toBeInTheDocument();
    expect(screen.getByTestId("top-right-slide")).toBeInTheDocument();
  });

  it("passes h2h indicator and availability to TopRightSlide when loaded", () => {
    (useLastFiveResults as any).mockReturnValue({
      lastFiveResults: {},
      loadingLastFiveResults: false,
    });
    (useTeamsScorePerformance as any).mockReturnValue({
      teamsPerformance: {},
      loadingTeamsPerformance: false,
    });
    (useRestStatus as any).mockReturnValue({
      restStatus: {},
      loadingRestStatus: false,
    });
    (useTeamLeaguesStats as any).mockReturnValue({
      ranksAndPoints: {},
      loadingRanksAndPoints: false,
    });
    (useOddsFeeling as any).mockReturnValue({
      oddsFeeling: {},
      loadingOddsFeeling: false,
    });
    (useHeadToHead as any).mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: false,
      isHead2HeadAvailable: true,
    });

    render(<MatchIndicators {...baseProps} />);

    expect(TopRightSlide).toHaveBeenCalledWith(
      expect.objectContaining({
        isH2HAvailable: true,
        h2hIndicator: expect.objectContaining({ label: "indicators.h2h_history" }),
      }),
      expect.anything()
    );
  });

  it("filters right slide when H2H is loading", () => {
    (useLastFiveResults as any).mockReturnValue({
      lastFiveResults: {},
      loadingLastFiveResults: false,
    });
    (useTeamsScorePerformance as any).mockReturnValue({
      teamsPerformance: {},
      loadingTeamsPerformance: false,
    });
    (useRestStatus as any).mockReturnValue({
      restStatus: {},
      loadingRestStatus: false,
    });
    (useTeamLeaguesStats as any).mockReturnValue({
      ranksAndPoints: {},
      loadingRanksAndPoints: false,
    });
    (useOddsFeeling as any).mockReturnValue({
      oddsFeeling: {},
      loadingOddsFeeling: false,
    });
    (useHeadToHead as any).mockReturnValue({
      h2hDetails: [],
      loadingH2hDetail: true,
      isHead2HeadAvailable: false,
    });

    render(<MatchIndicators {...baseProps} />);

    expect(screen.queryByTestId("top-right-slide")).not.toBeInTheDocument();
  });

  it("renders nothing if all slides are loading", () => {
    (useLastFiveResults as any).mockReturnValue({
      lastFiveResults: undefined,
      loadingLastFiveResults: true,
    });
    (useTeamsScorePerformance as any).mockReturnValue({
      teamsPerformance: undefined,
      loadingTeamsPerformance: true,
    });
    (useRestStatus as any).mockReturnValue({
      restStatus: undefined,
      loadingRestStatus: true,
    });
    (useTeamLeaguesStats as any).mockReturnValue({
      ranksAndPoints: undefined,
      loadingRanksAndPoints: true,
    });
    (useOddsFeeling as any).mockReturnValue({
      oddsFeeling: undefined,
      loadingOddsFeeling: true,
    });

    render(<MatchIndicators {...baseProps} />);

    expect(screen.queryByTestId("top-left-slide")).not.toBeInTheDocument();
    expect(screen.queryByTestId("top-right-slide")).not.toBeInTheDocument();
  });
});
