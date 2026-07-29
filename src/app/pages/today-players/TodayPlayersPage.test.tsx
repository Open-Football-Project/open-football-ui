import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import TodayPlayersPage from "./TodayPlayersPage";
import { BannerProps } from "../../common-props/BannerProps";
import { AnalyticsEvent } from "../../utils/analytics/analytics";

const mocks = vi.hoisted(() => ({
  useTodayPlayersStatus: vi.fn(),
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

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual<typeof import("open-football-project-core")>(
    "open-football-project-core",
  );
  return {
    ...actual,
    useTodayPlayersStatus: mocks.useTodayPlayersStatus,
  };
});

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading, message }: { loading?: boolean; message?: string }) => (
    <div data-testid="nodata">{loading ? "loading" : message}</div>
  ),
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title, apiService, bannersService }: any) => (
    <div data-testid="subheader">
      {title}-{apiService ? "has-api" : "no-api"}-{bannersService ? "has-banners" : "no-banners"}
    </div>
  ),
}));

vi.mock("../../components/general/controls/Controls", () => ({
  default: (props: any) => (
    <div data-testid="controls">
      <div data-testid="drop0-values">{props.drop0Options.map((o: any) => o.value).join("|")}</div>
      <div data-testid="drop0-selected">{props.selectedDrop0}</div>
      <div data-testid="drop1-values">{props.drop1Options.map((o: any) => o.value).join("|")}</div>
      <div data-testid="drop1-selected">{props.selectedDrop1}</div>
      <button onClick={() => props.setDrop0("2")}>Change League</button>
      <button onClick={() => props.setDrop1("102")}>Change Fixture</button>
    </div>
  ),
}));

vi.mock("../../components/today-players/today-players-position-row/TodayPlayersPositionRow", () => ({
  default: (props: any) => (
    <div data-testid="today-players-position-row">
      {props.position}:{props.homePlayerScores.length}:{props.awayPlayerScores.length}:
      {props.homeTeamName}:{props.awayTeamName}
    </div>
  ),
}));

const apiService = {} as any;

const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

const emptyStatus = (overrides = {}) => ({
  leagues: [],
  selectedLeagueId: undefined,
  setSelectedLeagueId: vi.fn(),
  fixturesInSelectedLeague: [],
  selectedFixtureId: undefined,
  setSelectedFixtureId: vi.fn(),
  selectedFixture: undefined,
  loadingTodayPlayers: false,
  isTodayPlayersAvailable: false,
  ...overrides,
});

describe("TodayPlayersPage", () => {
  it("calls useTodayPlayersStatus with apiService and no fixtureId when the route has none", () => {
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus());

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(mocks.useTodayPlayersStatus).toHaveBeenCalledWith(apiService, undefined);
  });

  it("calls useTodayPlayersStatus with apiService and the route fixtureId when present", () => {
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus());

    render(
      <MemoryRouter initialEntries={["/201"]}>
        <Routes>
          <Route path="/:fixtureId" element={<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(mocks.useTodayPlayersStatus).toHaveBeenCalledWith(apiService, "201");
  });

  it("renders NoData loading and wraps in noindex Seo while today-players are loading", () => {
    mocks.seo.mockClear();
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus({ loadingTodayPlayers: true }));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("nodata")).toHaveTextContent("loading");
    expect(screen.queryByTestId("today-players-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("subheader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("controls")).not.toBeInTheDocument();
    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });

  it("renders a no-data illustration and wraps in noindex Seo when nothing is cached", () => {
    mocks.seo.mockClear();
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus());

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("nodata")).not.toHaveTextContent("loading");
    expect(screen.getByTestId("nodata")).toBeInTheDocument();
    expect(screen.queryByTestId("today-players-page")).not.toBeInTheDocument();
    expect(screen.queryByTestId("subheader")).not.toBeInTheDocument();
    expect(screen.queryByTestId("controls")).not.toBeInTheDocument();
    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });

  const playerScore = (id: number, name: string) => ({
    player: { id, name, age: null, number: null, position: null, photo: null },
    score: 1,
    signal: "ODDS_IMPLIED",
    reason: { markets: ["Anytime Goal Scorer"] },
  });

  const twoLeaguesTwoFixtures = () => ({
    leagues: [
      { leagueId: 3, leagueName: "La Liga" },
      { leagueId: 2, leagueName: "Premier League" },
    ],
    selectedLeagueId: 3,
    fixturesInSelectedLeague: [
      { fixtureId: 201, homeTeamName: "Real Madrid", awayTeamName: "Barcelona" },
      { fixtureId: 202, homeTeamName: "Sevilla", awayTeamName: "Valencia" },
    ],
    selectedFixtureId: 201,
    selectedFixture: {
      fixtureId: 201,
      leagueId: 3,
      leagueName: "La Liga",
      homeTeamName: "Real Madrid",
      awayTeamName: "Barcelona",
      home: {
        GOALKEEPER: [],
        DEFENDER: [playerScore(1, "Militao")],
        MIDFIELDER: [playerScore(2, "Modric")],
        ATTACKER: [playerScore(3, "Mbappe")],
      },
      away: {
        GOALKEEPER: [],
        DEFENDER: [playerScore(4, "Araujo")],
        MIDFIELDER: [],
        ATTACKER: [playerScore(5, "Lewandowski")],
      },
    },
    isTodayPlayersAvailable: true,
  });

  it("renders the resolved fixture's team names without forcing noindex once data is available", () => {
    mocks.seo.mockClear();
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("today-players-page")).toHaveTextContent("Real Madrid vs Barcelona");
    expect(screen.queryByTestId("nodata")).not.toBeInTheDocument();
    expect(mocks.seo.mock.calls[0][0].robots).toBeUndefined();
    expect(screen.getByTestId("subheader")).toHaveTextContent("Today's Players-has-api-has-banners");
  });

  it("shows a predicted-before-kickoff disclaimer once a fixture is resolved", () => {
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("today-players-disclaimer")).toHaveTextContent(
      "Predicted before kickoff",
    );
  });

  it("renders Controls with league and fixture options and current selections once data is available", () => {
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("controls")).toBeInTheDocument();
    expect(screen.getByTestId("drop0-values")).toHaveTextContent("La Liga|Premier Lg.");
    expect(screen.getByTestId("drop0-selected")).toHaveTextContent("3");
    expect(screen.getByTestId("drop1-values")).toHaveTextContent("Real Madrid vs Barcelona|Sevilla vs Valencia");
    expect(screen.getByTestId("drop1-selected")).toHaveTextContent("201");
  });

  it("calls setSelectedLeagueId when the league dropdown changes", () => {
    const setSelectedLeagueId = vi.fn();
    mocks.useTodayPlayersStatus.mockReturnValue(
      emptyStatus({ ...twoLeaguesTwoFixtures(), setSelectedLeagueId }),
    );

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);
    screen.getByText("Change League").click();

    expect(setSelectedLeagueId).toHaveBeenCalledWith(2);
  });

  it("fires a FILTER_APPLIED event when the league dropdown changes", () => {
    mocks.trackEvent.mockClear();
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);
    screen.getByText("Change League").click();

    expect(mocks.trackEvent).toHaveBeenCalledWith(AnalyticsEvent.FILTER_APPLIED, {
      filter: "league",
      value: "2",
    });
  });

  it("calls setSelectedFixtureId when the fixture dropdown changes", () => {
    const setSelectedFixtureId = vi.fn();
    mocks.useTodayPlayersStatus.mockReturnValue(
      emptyStatus({ ...twoLeaguesTwoFixtures(), setSelectedFixtureId }),
    );

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);
    screen.getByText("Change Fixture").click();

    expect(setSelectedFixtureId).toHaveBeenCalledWith(102);
  });

  it("fires a FILTER_APPLIED event when the fixture dropdown changes", () => {
    mocks.trackEvent.mockClear();
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);
    screen.getByText("Change Fixture").click();

    expect(mocks.trackEvent).toHaveBeenCalledWith(AnalyticsEvent.FILTER_APPLIED, {
      filter: "fixture",
      value: "102",
    });
  });

  it("renders a fallback message when data is available but no fixture is resolved yet", () => {
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus({ isTodayPlayersAvailable: true }));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.getByTestId("today-players-page")).toHaveTextContent("no fixture");
  });

  it("renders a position row for every position with at least one player on either side, attackers first and goalkeepers last, skipping empty ones", () => {
    mocks.useTodayPlayersStatus.mockReturnValue(emptyStatus(twoLeaguesTwoFixtures()));

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    const rows = screen.getAllByTestId("today-players-position-row");
    expect(rows).toHaveLength(3);
    expect(rows[0]).toHaveTextContent("ATTACKER:1:1:Real Madrid:Barcelona");
    expect(rows[1]).toHaveTextContent("MIDFIELDER:1:0:Real Madrid:Barcelona");
    expect(rows[2]).toHaveTextContent("DEFENDER:1:1:Real Madrid:Barcelona");
  });

  it("renders no position rows when neither side has players at any position", () => {
    const fixtures = twoLeaguesTwoFixtures();
    mocks.useTodayPlayersStatus.mockReturnValue(
      emptyStatus({
        ...fixtures,
        selectedFixture: {
          ...fixtures.selectedFixture,
          home: { GOALKEEPER: [], DEFENDER: [], MIDFIELDER: [], ATTACKER: [] },
          away: { GOALKEEPER: [], DEFENDER: [], MIDFIELDER: [], ATTACKER: [] },
        },
      }),
    );

    render(<TodayPlayersPage apiService={apiService} bannerProps={bannerProps} />);

    expect(screen.queryByTestId("today-players-position-row")).not.toBeInTheDocument();
  });
});
