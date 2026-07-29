import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TeamDetailsPage from "./TeamDetailsPage";
import { useTeamDetail } from "open-football-project-core";
import { BannerProps } from "../../common-props/BannerProps";

const mocks = vi.hoisted(() => ({
  seo: vi.fn(({ children }: any) => <>{children}</>),
}));

vi.mock("../../components/team/team-details/team-info/TeamInfo", () => ({
  default: () => <div data-testid="team-info">Team Info</div>,
}));

vi.mock("../../components/team/team-details/team-squad/TeamSquad", () => ({
  TeamSquad: () => <div data-testid="team-squad">Team Squad</div>,
}));

vi.mock("../../components/team/team-fixture/TeamFixtureComponent", () => ({
  default: () => <div data-testid="team-fixture">Fixture</div>,
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: ({ title }: any) => <div data-testid="subheader">{title}</div>,
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: ({ loading }: any) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
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
    useTeamDetail: vi.fn(),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockTeamDetail = (overrides = {}) => ({
  loadingTeamDetails: false,
  teamDetails: {
    teamName: "Barcelona",
    teamLogo: "/barca.png",
  },
  teamPlayers: [{ id: 1, name: "Messi" }],
  teamLeagues: [],
  isTeamDetailsAvailable: true,
  isTeamPlayersAvailable: true,
  isTeamLeaguesAvailable: false,
  teamlinks: [],
  ...overrides,
});

const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

const renderPage = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/team/${id}`]}>
      <Routes>
        <Route
          path="/team/:id"
          element={
            <TeamDetailsPage
              apiService={{} as any}
              bannerProps={bannerProps}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("TeamDetailsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    (useTeamDetail as Mock).mockReturnValue(
      mockTeamDetail({ loadingTeamDetails: true })
    );

    renderPage();

    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders Seo with noindex while team data is loading", () => {
    (useTeamDetail as Mock).mockReturnValue(
      mockTeamDetail({ loadingTeamDetails: true })
    );

    renderPage();

    expect(mocks.seo).toHaveBeenCalled();
    expect(mocks.seo.mock.calls[0][0]).toMatchObject({
      robots: "noindex, nofollow",
    });
  });

  it("renders team info, fixture and squad when data is available", () => {
    (useTeamDetail as Mock).mockReturnValue(mockTeamDetail());

    renderPage();

    expect(screen.getByTestId("subheader")).toHaveTextContent("teampage.title");
    expect(screen.getByTestId("team-info")).toBeInTheDocument();
    expect(screen.getByTestId("team-fixture")).toBeInTheDocument();
    expect(screen.getByTestId("team-squad")).toBeInTheDocument();
  });

  it("renders NoData when team details are unavailable", () => {
    (useTeamDetail as Mock).mockReturnValue(
      mockTeamDetail({
        isTeamDetailsAvailable: false,
        teamDetails: null,
      })
    );

    renderPage();

    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("does not render squad when players are unavailable", () => {
    (useTeamDetail as Mock).mockReturnValue(
      mockTeamDetail({
        isTeamPlayersAvailable: false,
      })
    );

    renderPage();

    expect(screen.queryByTestId("team-squad")).not.toBeInTheDocument();
  });

  it("renders video content when team has videos", () => {
    (useTeamDetail as Mock).mockReturnValue(
      mockTeamDetail({
        teamDetails: {
          teamName: "Barcelona",
          teamLogo: "/barca.png",
          videos: [{ url: "https://youtube.com/embed/abc", label: "Team Highlights" }],
        },
      })
    );

    renderPage();

    expect(screen.getByTestId("video-content")).toHaveTextContent("Team Highlights");
  });

  it("does not render video content when team has no videos", () => {
    (useTeamDetail as Mock).mockReturnValue(
      mockTeamDetail({
        teamDetails: {
          teamName: "Barcelona",
          teamLogo: "/barca.png",
          videos: [],
        },
      })
    );

    renderPage();

    expect(screen.queryByTestId("video-content")).not.toBeInTheDocument();
  });
});
