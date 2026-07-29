import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ChartsPage from "./ChartsPage";
import { BannerProps } from "../../common-props/BannerProps";
import { AnalyticsEvent } from "../../utils/analytics/analytics";

const mocks = vi.hoisted(() => ({
  useChartsPageStatus: vi.fn(),
  useCharteableOddsStatus: vi.fn(),
  useBetMarkets: vi.fn(),
  seo: vi.fn(({ children }: any) => <>{children}</>),
  trackEvent: vi.fn(),
}));

vi.mock("../../utils/analytics/analytics", async () => {
  const actual = await vi.importActual<typeof import("../../utils/analytics/analytics")>(
    "../../utils/analytics/analytics",
  );
  return {
    ...actual,
    trackEvent: mocks.trackEvent,
  };
});

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual<typeof import("@matchinsights/core")>(
    "@matchinsights/core",
  );
  return {
    ...actual,
    useChartsPageStatus: mocks.useChartsPageStatus,
    useCharteableOddsStatus: mocks.useCharteableOddsStatus,
    useBetMarkets: mocks.useBetMarkets,
  };
});

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title, apiService, bannersService }: any) => (
    <div data-testid="subheader">
      {title}-{apiService ? "has-api" : "no-api"}-{bannersService ? "has-banners" : "no-banners"}
    </div>
  ),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

vi.mock("../../components/live-charts/panels/Panels", () => ({
  default: ({ panels }: { panels: { homeTeamName: string; points: unknown[]; title?: string }[] }) => (
    <div data-testid="panels">
      {panels
        .map((panel) => {
          const base = `${panel.homeTeamName}-${panel.points.length}`;
          return panel.title ? `${base}-${panel.title}` : base;
        })
        .join(",")}
    </div>
  ),
}));

vi.mock("../../components/live-charts/panels/odds/OddsMarketMenu", () => ({
  default: ({
    markets,
    enabledMarketNames,
    onToggleMarket,
    onClose,
  }: {
    markets: { name: string }[];
    enabledMarketNames: string[];
    onToggleMarket: (name: string) => void;
    onClose: () => void;
  }) => (
    <div data-testid="odds-market-menu">
      {markets.map((market) => (
        <button
          key={market.name}
          data-testid={`toggle-${market.name}`}
          aria-pressed={enabledMarketNames.includes(market.name)}
          onClick={() => onToggleMarket(market.name)}
        >
          {market.name}
        </button>
      ))}
      <button data-testid="odds-market-menu-close" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading, message }: { loading?: boolean; message?: string }) => (
    <div data-testid="nodata">{loading ? "loading" : message}</div>
  ),
}));

vi.mock("../../components/general/controls/Controls", () => ({
  default: (props: any) => (
    <div data-testid="controls" onClick={() => props.setDrop0("102")}>
      {props.selectedDrop0}-{props.drop0Options.length}
      <div data-testid="drop0-values">
        {props.drop0Options.map((o: any) => o.value).join("|")}
      </div>
    </div>
  ),
}));

const apiService = {} as any;
const apiHost = "http://localhost";
const apiMock = 0;

const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

const chartMatches = [
  { fixtureId: 201, homeTeamName: "Real Madrid", awayTeamName: "Barcelona" },
  { fixtureId: 202, homeTeamName: "Bayern", awayTeamName: "Dortmund" },
];

const oddsMatches = [
  { fixtureId: 101, homeTeamName: "Arsenal", awayTeamName: "Chelsea" },
  { fixtureId: 102, homeTeamName: "Man City", awayTeamName: "Liverpool" },
];

const emptyChartsStatus = (overrides = {}) => ({
  chartMatches: [],
  loadingChartMatches: false,
  isChartNotAvailable: true,
  homeTeamName: undefined,
  awayTeamName: undefined,
  momentumPoints: [],
  controlPoints: [],
  goalThreatPoints: [],
  effectiveFixtureId: undefined,
  setEffectiveFixtureId: vi.fn(),
  ...overrides,
});

const emptyOddsStatus = (overrides = {}) => ({
  oddsMatches: [],
  effectiveFixtureId: undefined,
  setEffectiveFixtureId: vi.fn(),
  isOddsNotAvailable: true,
  homeTeamName: undefined,
  awayTeamName: undefined,
  oddsEventReceivedAt: 0,
  ...overrides,
});

const setMocks = ({
  charts = emptyChartsStatus(),
  odds = emptyOddsStatus(),
  betMarketGroups = [] as unknown[],
} = {}) => {
  mocks.useChartsPageStatus.mockReturnValue(charts);
  mocks.useCharteableOddsStatus.mockReturnValue(odds);
  mocks.useBetMarkets.mockReturnValue({
    betMarketGroups,
    loadingBetMarkets: false,
    isBetMarketsAvailable: betMarketGroups.length > 0,
  });
};

describe("ChartsPage", () => {
  it("renders NoData loading while chart matches are loading", () => {
    setMocks({ charts: emptyChartsStatus({ loadingChartMatches: true }) });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("nodata")).toHaveTextContent("loading");
    expect(screen.queryByTestId("controls")).not.toBeInTheDocument();
  });

  it("renders a full-page no-matches message, with no toggle, when neither odds nor indicators have any matches", () => {
    setMocks();

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("nodata")).not.toHaveTextContent("loading");
    expect(screen.queryByTestId("controls")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mode-toggle-odds")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mode-toggle-indicators")).not.toBeInTheDocument();
  });

  it("defaults to Odds mode and renders the default three-market panel list when the odds list is non-empty", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [
        [
          { id: 1, name: "fulltime_result", history: {} },
          { id: 2, name: "both_teams_to_score", history: {} },
          { id: 3, name: "draw_no_bet", history: {} },
        ],
      ],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("panels")).toHaveTextContent(
      "Arsenal-0-fulltime_result,Arsenal-0-both_teams_to_score,Arsenal-0-draw_no_bet",
    );
    expect(screen.queryByTestId("left-odds-group")).not.toBeInTheDocument();
    expect(screen.queryByTestId("right-odds-group")).not.toBeInTheDocument();
    expect(screen.getByTestId("controls")).toHaveTextContent("101-2");
  });

  it("omits a default market's panel when it is missing from betMarketGroups, without erroring", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [[{ id: 1, name: "fulltime_result", history: {} }]],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("panels")).toHaveTextContent("Arsenal-0-fulltime_result");
    expect(screen.getByTestId("panels")).not.toHaveTextContent("both_teams_to_score");
    expect(screen.getByTestId("panels")).not.toHaveTextContent("draw_no_bet");
  });

  it("falls back to Indicators mode automatically when the odds list is empty but indicators has data", () => {
    setMocks({
      charts: emptyChartsStatus({
        chartMatches,
        effectiveFixtureId: 201,
        homeTeamName: "Real Madrid",
        awayTeamName: "Barcelona",
        isChartNotAvailable: false,
        momentumPoints: [{ minute: 5, value: 20, capturedAt: "t" }],
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("panels")).toHaveTextContent("Real Madrid-1");
    expect(screen.queryByTestId("odds-panel-group")).not.toBeInTheDocument();
    expect(screen.getByTestId("controls")).toHaveTextContent("201-2");
  });

  it("keeps Indicators mode active on a later tick even if the odds list becomes available afterward", () => {
    setMocks({
      charts: emptyChartsStatus({
        chartMatches,
        effectiveFixtureId: 201,
        homeTeamName: "Real Madrid",
        awayTeamName: "Barcelona",
        isChartNotAvailable: false,
      }),
    });

    const { rerender } = render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    expect(screen.getByTestId("panels")).toBeInTheDocument();

    mocks.useCharteableOddsStatus.mockReturnValue(
      emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
    );

    rerender(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("panels")).toBeInTheDocument();
    expect(screen.queryByText(/fulltime_result|both_teams_to_score/)).not.toBeInTheDocument();
  });

  it("resolves to Odds mode for a route fixture id present in the odds list", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 102,
        homeTeamName: "Man City",
        awayTeamName: "Liverpool",
        isOddsNotAvailable: false,
      }),
      charts: emptyChartsStatus({ chartMatches, isChartNotAvailable: false }),
    });

    render(
      <MemoryRouter initialEntries={["/102"]}>
        <Routes>
          <Route path="/:fixtureId" element={<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("panels").textContent).toBe("");
  });

  it("falls back to Indicators mode for a route fixture id absent from odds but present in chartMatches", () => {
    setMocks({
      odds: emptyOddsStatus(),
      charts: emptyChartsStatus({
        chartMatches,
        effectiveFixtureId: 202,
        homeTeamName: "Bayern",
        awayTeamName: "Dortmund",
        isChartNotAvailable: false,
      }),
    });

    render(
      <MemoryRouter initialEntries={["/202"]}>
        <Routes>
          <Route path="/:fixtureId" element={<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("panels")).toHaveTextContent("Bayern-0");
  });

  it("lets the user manually switch mode with the toggle, regardless of auto-resolution", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      charts: emptyChartsStatus({ chartMatches, isChartNotAvailable: false }),
      betMarketGroups: [[{ id: 1, name: "fulltime_result", history: {} }]],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    expect(screen.getByTestId("panels")).toHaveTextContent("fulltime_result");

    fireEvent.click(screen.getByTestId("mode-toggle-indicators"));

    expect(screen.queryByText(/fulltime_result/)).not.toBeInTheDocument();
    expect(screen.getByTestId("controls")).toHaveTextContent(`${chartMatches.length}`);
  });

  it("calls the odds effectiveFixtureId setter when the picker changes in Odds mode", () => {
    const setOddsEffectiveFixtureId = vi.fn();
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
        setEffectiveFixtureId: setOddsEffectiveFixtureId,
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    fireEvent.click(screen.getByTestId("controls"));

    expect(setOddsEffectiveFixtureId).toHaveBeenCalledWith(102);
  });

  it("calls the indicators effectiveFixtureId setter when the picker changes in Indicators mode", () => {
    const setChartsEffectiveFixtureId = vi.fn();
    setMocks({
      charts: emptyChartsStatus({
        chartMatches,
        effectiveFixtureId: 201,
        homeTeamName: "Real Madrid",
        awayTeamName: "Barcelona",
        isChartNotAvailable: false,
        setEffectiveFixtureId: setChartsEffectiveFixtureId,
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    fireEvent.click(screen.getByTestId("controls"));

    expect(setChartsEffectiveFixtureId).toHaveBeenCalledWith(102);
  });

  it("passes apiService, the odds effective fixture id and oddsEventReceivedAt to useBetMarkets", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
        oddsEventReceivedAt: 555,
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(mocks.useBetMarkets).toHaveBeenCalledWith(apiService, 101, 555);
  });

  it("shows NoData in the content area but keeps the toggle when the current mode has no fixture resolved", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      charts: emptyChartsStatus(),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    fireEvent.click(screen.getByTestId("mode-toggle-indicators"));

    expect(screen.getByTestId("nodata")).toBeInTheDocument();
    expect(screen.getByTestId("mode-toggle-odds")).toBeInTheDocument();
  });
});

describe("ChartsPage, odds market menu", () => {
  const threeDefaultMarkets = [
    { id: 1, name: "fulltime_result", history: {} },
    { id: 2, name: "both_teams_to_score", history: {} },
    { id: 3, name: "draw_no_bet", history: {} },
  ];

  it("shows the menu toggle only in Odds mode", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      charts: emptyChartsStatus({ chartMatches, isChartNotAvailable: false }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    expect(screen.getByTestId("odds-market-menu-toggle")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mode-toggle-indicators"));
    expect(screen.queryByTestId("odds-market-menu-toggle")).not.toBeInTheDocument();
  });

  it("opens the menu when its toggle is clicked, and closes it via the menu's close control", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [threeDefaultMarkets],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    expect(screen.queryByTestId("odds-market-menu")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("odds-market-menu-toggle"));
    expect(screen.getByTestId("odds-market-menu")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("odds-market-menu-close"));
    expect(screen.queryByTestId("odds-market-menu")).not.toBeInTheDocument();
  });

  it("fires a MENU_TOGGLED event when the menu is opened and closed", () => {
    mocks.trackEvent.mockClear();
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [threeDefaultMarkets],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    fireEvent.click(screen.getByTestId("odds-market-menu-toggle"));
    expect(mocks.trackEvent).toHaveBeenCalledWith(AnalyticsEvent.MENU_TOGGLED, {
      menu: "odds_markets",
      state: "open",
    });

    fireEvent.click(screen.getByTestId("odds-market-menu-close"));
    expect(mocks.trackEvent).toHaveBeenCalledWith(AnalyticsEvent.MENU_TOGGLED, {
      menu: "odds_markets",
      state: "closed",
    });
  });

  it("fires a FILTER_APPLIED event when a market is toggled via the menu", () => {
    mocks.trackEvent.mockClear();
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [threeDefaultMarkets],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    fireEvent.click(screen.getByTestId("odds-market-menu-toggle"));
    fireEvent.click(screen.getByTestId("toggle-fulltime_result"));

    expect(mocks.trackEvent).toHaveBeenCalledWith(AnalyticsEvent.FILTER_APPLIED, {
      filter: "odds_market",
      value: "fulltime_result",
      enabled: "false",
    });
  });

  it("removes a default market's panel when disabled via the menu, and restores it when re-enabled", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [threeDefaultMarkets],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    expect(screen.getByTestId("panels")).toHaveTextContent(
      "Arsenal-0-fulltime_result,Arsenal-0-both_teams_to_score,Arsenal-0-draw_no_bet",
    );

    fireEvent.click(screen.getByTestId("odds-market-menu-toggle"));
    fireEvent.click(screen.getByTestId("toggle-fulltime_result"));

    expect(screen.getByTestId("panels")).toHaveTextContent(
      "Arsenal-0-both_teams_to_score,Arsenal-0-draw_no_bet",
    );
    expect(screen.getByTestId("panels")).not.toHaveTextContent("fulltime_result");

    fireEvent.click(screen.getByTestId("toggle-fulltime_result"));

    expect(screen.getByTestId("panels")).toHaveTextContent(
      "Arsenal-0-both_teams_to_score,Arsenal-0-draw_no_bet,Arsenal-0-fulltime_result",
    );
  });

  it("adds a panel for a non-default market when enabled via the menu", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [[
        { id: 1, name: "fulltime_result", history: {} },
        { id: 4, name: "double_chance", history: {} },
      ]],
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    fireEvent.click(screen.getByTestId("odds-market-menu-toggle"));
    fireEvent.click(screen.getByTestId("toggle-double_chance"));

    expect(screen.getByTestId("panels")).toHaveTextContent(
      "Arsenal-0-fulltime_result,Arsenal-0-double_chance",
    );
  });

  it("resets the enabled market set back to the default three when the odds effective fixture changes", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
      betMarketGroups: [threeDefaultMarkets],
    });

    const { rerender } = render(
      <ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />,
    );

    fireEvent.click(screen.getByTestId("odds-market-menu-toggle"));
    fireEvent.click(screen.getByTestId("toggle-fulltime_result"));
    expect(screen.getByTestId("panels")).not.toHaveTextContent("fulltime_result");

    mocks.useCharteableOddsStatus.mockReturnValue(
      emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 102,
        homeTeamName: "Man City",
        awayTeamName: "Liverpool",
        isOddsNotAvailable: false,
      }),
    );

    rerender(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(screen.getByTestId("panels")).toHaveTextContent(
      "Man City-0-fulltime_result,Man City-0-both_teams_to_score,Man City-0-draw_no_bet",
    );
  });
});

describe("ChartsPage, SubHeader", () => {
  it("renders SubHeader above Controls, wired with apiService and bannersService", () => {
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
    });

    const { container } = render(
      <ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />,
    );

    expect(screen.getByTestId("subheader")).toHaveTextContent("has-api-has-banners");
    const html = container.innerHTML;
    expect(html.indexOf('data-testid="subheader"')).toBeGreaterThanOrEqual(0);
    expect(html.indexOf('data-testid="subheader"')).toBeLessThan(
      html.indexOf('data-testid="controls"'),
    );
  });
});

describe("ChartsPage, Seo", () => {
  it("wraps the loading state in Seo with noindex robots", () => {
    mocks.seo.mockClear();
    setMocks({ charts: emptyChartsStatus({ loadingChartMatches: true }) });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });

  it("wraps the full no-matches state in Seo with noindex robots", () => {
    mocks.seo.mockClear();
    setMocks();

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });

  it("wraps the main content in Seo without forcing noindex", () => {
    mocks.seo.mockClear();
    setMocks({
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    expect(mocks.seo.mock.calls[0][0].robots).toBeUndefined();
  });
});

describe("ChartsPage, live marker in the dropdown", () => {
  it("prefixes a live fixture's label with the live marker in Indicators mode", () => {
    setMocks({
      charts: emptyChartsStatus({
        chartMatches: [
          {
            fixtureId: 201,
            homeTeamName: "Real Madrid",
            awayTeamName: "Barcelona",
            indicators: {
              momentum: [{ minute: 60, value: 10, capturedAt: new Date().toISOString() }],
            },
          },
          {
            fixtureId: 202,
            homeTeamName: "Bayern",
            awayTeamName: "Dortmund",
            indicators: {
              momentum: [{ minute: 80, value: 10, capturedAt: "2020-01-01T00:00:00Z" }],
            },
          },
        ],
        effectiveFixtureId: 201,
        homeTeamName: "Real Madrid",
        awayTeamName: "Barcelona",
        isChartNotAvailable: false,
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);
    fireEvent.click(screen.getByTestId("mode-toggle-indicators"));

    const values = screen.getByTestId("drop0-values").textContent ?? "";
    expect(values).toContain("🔴 Real Madrid vs Barcelona");
    expect(values).toContain("Bayern vs Dortmund");
    expect(values).not.toContain("🔴 Bayern vs Dortmund");
  });

  it("prefixes an odds fixture's label with the live marker using chartMatches indicator data, by fixtureId", () => {
    setMocks({
      charts: emptyChartsStatus({
        chartMatches: [
          {
            fixtureId: 101,
            homeTeamName: "Arsenal",
            awayTeamName: "Chelsea",
            indicators: {
              momentum: [{ minute: 60, value: 10, capturedAt: new Date().toISOString() }],
            },
          },
        ],
      }),
      odds: emptyOddsStatus({
        oddsMatches,
        effectiveFixtureId: 101,
        homeTeamName: "Arsenal",
        awayTeamName: "Chelsea",
        isOddsNotAvailable: false,
      }),
    });

    render(<ChartsPage apiService={apiService} bannerProps={bannerProps} apiHost={apiHost} apiMock={apiMock} />);

    const values = screen.getByTestId("drop0-values").textContent ?? "";
    expect(values).toContain("🔴 Arsenal vs Chelsea");
    expect(values).toContain("Man City vs Liverpool");
    expect(values).not.toContain("🔴 Man City vs Liverpool");
  });
});
