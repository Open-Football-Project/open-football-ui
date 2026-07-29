import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LeaguePage from "./LeaguePage";
import { ApiService } from "open-football-project-core";
import { BannerProps } from "../../common-props/BannerProps";
import {
  mockLeagueInfo,
  mockLeagueFixture,
  mockLeagueRankingPlayers,
} from "open-football-project-core";

import { useLeaguePage } from "open-football-project-core";

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title, optionalLinks }: any) => (
    <div data-testid="subheader">
      <span>{title}</span>
      {optionalLinks?.map((link: any) => (
        <a key={link.url} href={link.url}>
          {link.label}
        </a>
      ))}
    </div>
  ),
}));

vi.mock(
  "../../components/league/league-fixture/LeagueFixtureComponent",
  () => ({
    LeagueFixtureComponent: ({ loading }: { loading: boolean }) => (
      <div data-testid="fixture">
        {loading ? "Loading Fixture" : "Fixture Loaded"}
      </div>
    ),
  })
);

vi.mock("../../components/league/league-standing/LeagueStanding", () => ({
  default: ({ loading }: { loading: boolean }) => (
    <div data-testid="standing">
      {loading ? "Loading Standing" : "Standing Loaded"}
    </div>
  ),
}));

vi.mock(
  "../../components/league/league-rankings/league-ranking-tabs/LeagueRankingTab",
  () => ({
    default: ({ topScorers, assists, yellowCards, redCards }: any) => (
      <div data-testid="rankings">Tabs Loaded</div>
    ),
  })
);

vi.mock("../../components/general/no-data/NoData", () => ({
  default: () => <div>Not Available</div>,
}));

vi.mock("../../main/seo/Seo", () => ({
  default: ({ children }: any) => <>{children}</>,
}));

vi.mock("../../main/seo/breadcrumb/Breadcrumb", () => ({
  default: () => null,
}));

vi.mock("../../components/general/video-content/VideoContentComponent", () => ({
  default: ({ videos }: any) => (
    <div data-testid="video-content">{videos.map((v: any) => v.label).join(", ")}</div>
  ),
}));

vi.mock("../../components/general/banners/country-banners/CountryBanners", () => ({
  default: () => null,
}));

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useLeaguePage: vi.fn(),
  };
});

const mockLeaguePage = (overrides = {}) => ({
  fixtures: mockLeagueFixture,
  leagueInfo: mockLeagueInfo,
  loadingFixtures: false,
  loadingLeagueInfo: false,
  isLeagueInfoAvailable: true,
  isLeaguefixturesAvailable: true,

  topScorers: mockLeagueRankingPlayers,
  assists: mockLeagueRankingPlayers,
  yellowCards: mockLeagueRankingPlayers,
  redCards: mockLeagueRankingPlayers,

  isTopScorersAvailable: true,
  isAssistsAvailable: true,
  isYellowCardsAvailable: true,
  isRedCardsAvailable: true,

  leagueLinks: [],
  ...overrides,
});

const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

const renderLeaguePage = (path = "/league/1") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/league/:leagueId"
          element={
            <LeaguePage
              apiService={{} as ApiService}
              bannerProps={bannerProps}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("LeaguePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLeaguePage as Mock).mockReturnValue(mockLeaguePage());
  });

  it("renders SubHeader, Standing, Fixture, and Rankings when data is available", () => {
    renderLeaguePage();

    expect(screen.getByTestId("subheader")).toHaveTextContent("Premier Lg.");
    expect(screen.getByTestId("standing")).toHaveTextContent("Standing Loaded");
    expect(screen.getByTestId("fixture")).toHaveTextContent("Fixture Loaded");
    expect(screen.getByTestId("rankings")).toBeInTheDocument();
  });

  it("hides components when data is unavailable", async () => {
    (useLeaguePage as Mock).mockReturnValue(
      mockLeaguePage({
        fixtures: undefined,
        leagueInfo: undefined,
        isLeagueInfoAvailable: false,
        isLeaguefixturesAvailable: false,
        isTopScorersAvailable: false,
        isAssistsAvailable: false,
        isYellowCardsAvailable: false,
        isRedCardsAvailable: false,
        topScorers: [],
        assists: [],
        yellowCards: [],
        redCards: [],
      })
    );

    renderLeaguePage("/league/3");

    await waitFor(() =>
      expect(screen.getByTestId("subheader")).toBeInTheDocument()
    );

    expect(screen.queryByTestId("standing")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fixture")).not.toBeInTheDocument();
    expect(screen.queryByTestId("rankings")).not.toBeInTheDocument();
    expect(screen.getByText("Not Available")).toBeInTheDocument();
  });

  it("renders knockout optional link", async () => {
    (useLeaguePage as Mock).mockReturnValue(
      mockLeaguePage({
        leagueLinks: [
          {
            label: "knockout.button",
            url: "/knockout/league/99",
          },
        ],
      })
    );

    renderLeaguePage("/league/99");

    const link = await screen.findByText("knockout.button");
    expect(link.closest("a")).toHaveAttribute("href", "/knockout/league/99");
  });

  it("renders multiple groups link", async () => {
    (useLeaguePage as Mock).mockReturnValue(
      mockLeaguePage({
        leagueLinks: [
          {
            label: "lggroups.button",
            url: "/groups/league/99",
          },
        ],
      })
    );

    renderLeaguePage("/league/99");

    const link = await screen.findByText("lggroups.button");
    expect(link.closest("a")).toHaveAttribute("href", "/groups/league/99");
  });

  it("renders video content when league has videos", () => {
    (useLeaguePage as Mock).mockReturnValue(
      mockLeaguePage({
        leagueInfo: {
          ...mockLeagueInfo,
          videos: [{ url: "https://youtube.com/embed/abc", label: "League Highlights" }],
        },
      })
    );

    renderLeaguePage();

    expect(screen.getByTestId("video-content")).toHaveTextContent("League Highlights");
  });

  it("does not render video content when league has no videos", () => {
    (useLeaguePage as Mock).mockReturnValue(
      mockLeaguePage({
        leagueInfo: { ...mockLeagueInfo, videos: [] },
      })
    );

    renderLeaguePage();

    expect(screen.queryByTestId("video-content")).not.toBeInTheDocument();
  });
});
