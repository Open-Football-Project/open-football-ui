import { render, screen } from "@testing-library/react";
import { vi, Mock, describe, it, expect, beforeEach } from "vitest";
import GuessTeamPlayerPage from "./GuessTeamPlayerPage";

const mocks = vi.hoisted(() => ({
  seo: vi.fn(({ children }: any) => <>{children}</>),
}));
import { useParams } from "react-router-dom";
import { BannerProps } from "../../common-props/BannerProps";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

vi.mock("open-football-project-core", async () => {
  const actual = await vi.importActual("open-football-project-core");
  return {
    ...actual,
    useTeamDetail: vi.fn(),
    useTeamLeagues: vi.fn(),
    useGuessThePlayer: vi.fn(),
  };
});

vi.mock("../../components/games/player/GuessThePlayer", () => ({
  default: vi.fn(() => (
    <div data-testid="mock-guess-player">Guess Player Component</div>
  )),
}));

vi.mock("../../components/general/no-data/NoData", () => ({
  default: vi.fn(({ loading, message }) => (
    <div data-testid="mock-nodata">
      {loading ? "Loading..." : message || "No Data"}
    </div>
  )),
}));

vi.mock("../../components/general/sub-header/SubHeader", () => ({
  default: vi.fn(({ title }) => (
    <div data-testid="mock-subheader">{title}</div>
  )),
}));

vi.mock("../../main/seo/Seo", () => ({
  default: (props: any) => mocks.seo(props),
}));

vi.mock("../../main/seo/team-metadata", () => ({
  default: vi.fn(),
}));

import { useTeamDetail, useGuessThePlayer } from "open-football-project-core";

const mockUseTeamDetail = (overrides = {}) => {
  (useTeamDetail as Mock).mockReturnValue({
    loadingTeamDetails: false,
    loadingTeamLeagues: false,
    teamDetails: {
      teamName: "Barcelona",
      teamLogo: "/barca.png",
    },
    teamlinks: [],
    canDisplayTeamPlayerGame: true,
    ...overrides,
  });
};

const mockUseGuessThePlayer = (overrides = {}) => {
  (useGuessThePlayer as Mock).mockReturnValue({
    loadingGuessThePlayer: false,
    isGuessThePlayerAvailable: true,
    guessThePlayer: {
      playerName: "Messi",
      options: ["Messi", "Neymar"],
      hints: [],
    },
    getNewGame: vi.fn(),
    ...overrides,
  });
};

const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

describe("GuessTeamPlayerPage", () => {
  const apiServiceMock = {} as any;
  const mockUseParams = useParams as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: "1" });
  });

  it("renders loading state", () => {
    mockUseTeamDetail({ loadingTeamDetails: true });
    mockUseGuessThePlayer({ loadingGuessThePlayer: true });

    render(
      <GuessTeamPlayerPage
        apiService={apiServiceMock}
        bannerProps={bannerProps}
      />
    );

    expect(screen.getByTestId("mock-nodata")).toHaveTextContent("Loading...");
  });

  it("renders 'Not Available' message when game cannot be displayed", () => {
    mockUseTeamDetail({
      canDisplayTeamPlayerGame: false,
      teamDetails: { teamName: "Barcelona" },
    });
    mockUseGuessThePlayer();

    render(
      <GuessTeamPlayerPage
        apiService={apiServiceMock}
        bannerProps={bannerProps}
      />
    );

    expect(
      screen.getByText("common.not_available_for Barcelona")
    ).toBeInTheDocument();
  });

  it("renders SubHeader and GuessThePlayer when data is available", () => {
    mockUseTeamDetail();
    mockUseGuessThePlayer();

    render(
      <GuessTeamPlayerPage
        apiService={apiServiceMock}
        bannerProps={bannerProps}
      />
    );

    expect(screen.getByTestId("mock-subheader")).toHaveTextContent(
      "quiz.player_quiz"
    );
    expect(screen.getByTestId("mock-guess-player")).toBeInTheDocument();
  });

  it("does not render GuessThePlayer when game data is unavailable", () => {
    mockUseTeamDetail();
    mockUseGuessThePlayer({
      isGuessThePlayerAvailable: false,
      guessThePlayer: null,
    });

    render(
      <GuessTeamPlayerPage
        apiService={apiServiceMock}
        bannerProps={bannerProps}
      />
    );

    expect(screen.queryByTestId("mock-guess-player")).not.toBeInTheDocument();
  });
});

describe("GuessTeamPlayerPage, Seo in unavailable state", () => {
  const apiServiceMock = {} as any;
  const mockUseParams = useParams as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.seo.mockClear();
    mockUseParams.mockReturnValue({ id: "1" });
  });

  it("renders Seo with noindex when game cannot be displayed", () => {
    (useTeamDetail as Mock).mockReturnValue({
      loadingTeamDetails: false,
      loadingTeamLeagues: false,
      teamDetails: { teamName: "Barcelona", teamLogo: "/barca.png" },
      teamlinks: [],
      canDisplayTeamPlayerGame: false,
    });
    (useGuessThePlayer as Mock).mockReturnValue({
      loadingGuessThePlayer: false,
      isGuessThePlayerAvailable: false,
      guessThePlayer: null,
      getNewGame: vi.fn(),
    });

    render(
      <GuessTeamPlayerPage apiService={apiServiceMock} bannerProps={bannerProps} />
    );

    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });

  it("renders Seo with noindex while team or game data is loading", () => {
    (useTeamDetail as Mock).mockReturnValue({
      loadingTeamDetails: true,
      loadingTeamLeagues: false,
      teamDetails: undefined,
      teamlinks: [],
      canDisplayTeamPlayerGame: false,
    });
    (useGuessThePlayer as Mock).mockReturnValue({
      loadingGuessThePlayer: false,
      isGuessThePlayerAvailable: false,
      guessThePlayer: null,
      getNewGame: vi.fn(),
    });

    render(
      <GuessTeamPlayerPage apiService={apiServiceMock} bannerProps={bannerProps} />
    );

    expect(mocks.seo).toHaveBeenCalled();
    expect(mocks.seo.mock.calls[0][0]).toMatchObject({ robots: "noindex, nofollow" });
  });
});
