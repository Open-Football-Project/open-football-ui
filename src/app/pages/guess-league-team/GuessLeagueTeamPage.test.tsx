import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, vi, beforeEach, expect } from "vitest";
import GuessLeagueTeamPage from "./GuessLeagueTeamPage";
import NoData from "../../components/general/no-data/NoData";
import SubHeader from "../../components/general/sub-header/SubHeader";
import GuessTheTeam from "../../components/games/team/GuessTheTeam";
import { BannerProps } from "../../common-props/BannerProps";

const mocks = vi.hoisted(() => ({
  mockUseGuessTheTeam: vi.fn(),
  mockUseLeaguePage: vi.fn(),
  mockAnyMainLeagueId: vi.fn(),
  mockUseParams: vi.fn(),
  seo: vi.fn(({ children }: any) => <>{children}</>),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: vi.fn(() => <div>NoDataMock</div>),
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: vi.fn(() => <div>SubHeaderMock</div>),
}));

vi.mock("../../components/games/team/GuessTheTeam", () => ({
  default: vi.fn(() => <div>GuessTheTeamMock</div>),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useParams: mocks.mockUseParams,
  };
});

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual<typeof import("open-football-project-core")>(
    "open-football-project-core"
  );

  return {
    ...actual,
    useGuessTheTeam: mocks.mockUseGuessTheTeam,
    useLeaguePage: mocks.mockUseLeaguePage,
    anyMainLeagueId: mocks.mockAnyMainLeagueId,
  };
});

const apiService = {};
const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

describe("GuessLeagueTeamPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mockUseParams.mockReturnValue({ id: "123" });
    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: null,
      loadingLeagueInfo: false,
      isLeagueInfoAvailable: false,
    });
    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: false,
      isGuessTheTeamAvailable: false,
      guessTheTeam: null,
      getNewGame: vi.fn(),
    });
    mocks.mockAnyMainLeagueId.mockReturnValue(false);
  });

  it("renders loading state", () => {
    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: null,
      loadingLeagueInfo: true,
      isLeagueInfoAvailable: false,
    });

    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: true,
      isGuessTheTeamAvailable: false,
      guessTheTeam: null,
      getNewGame: vi.fn(),
    });

    render(
      <MemoryRouter>
        <GuessLeagueTeamPage
          apiService={apiService}
          bannerProps={bannerProps}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("NoDataMock")).toBeInTheDocument();
    expect(NoData).toHaveBeenCalledWith(
      expect.objectContaining({ loading: true }),
      {}
    );
  });

  it("renders NoData when game not available", () => {
    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: { name: "Premier League" },
      loadingLeagueInfo: false,
      isLeagueInfoAvailable: true,
    });

    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: false,
      isGuessTheTeamAvailable: false,
      guessTheTeam: null,
      getNewGame: vi.fn(),
    });

    mocks.mockAnyMainLeagueId.mockReturnValue(true);

    render(
      <MemoryRouter>
        <GuessLeagueTeamPage
          apiService={apiService}
          bannerProps={bannerProps}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("NoDataMock")).toBeInTheDocument();
    expect(NoData).toHaveBeenCalledWith(
      expect.objectContaining({
        isBigMessage: true,
        message: "common.not_available_for Premier League",
      }),
      {}
    );
  });

  it("renders SubHeader and GuessTheTeam when data is available", () => {
    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: { name: "La Liga", logo: "laliga.png" },
      loadingLeagueInfo: false,
      isLeagueInfoAvailable: true,
    });

    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: false,
      isGuessTheTeamAvailable: true,
      guessTheTeam: { teamName: "Real Madrid" },
      getNewGame: vi.fn(),
    });

    mocks.mockAnyMainLeagueId.mockReturnValue(true);

    render(
      <MemoryRouter>
        <GuessLeagueTeamPage
          apiService={apiService}
          bannerProps={bannerProps}
        />
      </MemoryRouter>
    );

    expect(SubHeader).toHaveBeenCalled();
    expect(GuessTheTeam).toHaveBeenCalled();
    expect(screen.getByText("SubHeaderMock")).toBeInTheDocument();
    expect(screen.getByText("GuessTheTeamMock")).toBeInTheDocument();
  });

  it("handles missing ID gracefully", () => {
    mocks.mockUseParams.mockReturnValue({ id: undefined });

    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: null,
      loadingLeagueInfo: false,
      isLeagueInfoAvailable: false,
    });

    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: false,
      isGuessTheTeamAvailable: false,
      guessTheTeam: null,
      getNewGame: vi.fn(),
    });

    mocks.mockAnyMainLeagueId.mockReturnValue(false);

    render(
      <MemoryRouter>
        <GuessLeagueTeamPage
          apiService={apiService}
          bannerProps={bannerProps}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("NoDataMock")).toBeInTheDocument();
  });
});

describe("GuessLeagueTeamPage, Seo without data", () => {

    it("renders Seo with noindex when game is not available", () => {
    mocks.seo.mockClear();
    mocks.mockUseParams.mockReturnValue({ id: "123" });
    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: { name: "Premier League" },
      loadingLeagueInfo: false,
      isLeagueInfoAvailable: true,
    });
    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: false,
      isGuessTheTeamAvailable: false,
      guessTheTeam: null,
      getNewGame: vi.fn(),
    });
    mocks.mockAnyMainLeagueId.mockReturnValue(true);

    render(
      <MemoryRouter>
        <GuessLeagueTeamPage apiService={apiService} bannerProps={bannerProps} />
      </MemoryRouter>
    );

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });
  it("renders Seo with noindex while data is loading", () => {
    mocks.seo.mockClear();
    mocks.mockUseParams.mockReturnValue({ id: "123" });
    mocks.mockUseLeaguePage.mockReturnValue({
      leagueLinks: [],
      leagueInfo: null,
      loadingLeagueInfo: true,
      isLeagueInfoAvailable: false,
    });
    mocks.mockUseGuessTheTeam.mockReturnValue({
      loadingGuessTheTeam: true,
      isGuessTheTeamAvailable: false,
      guessTheTeam: null,
      getNewGame: vi.fn(),
    });
    mocks.mockAnyMainLeagueId.mockReturnValue(false);

    render(
      <MemoryRouter>
        <GuessLeagueTeamPage apiService={apiService} bannerProps={bannerProps} />
      </MemoryRouter>
    );

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });
});
