import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GuessTheTeam from "./GuessTheTeam";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { BannerProps } from "../../../common-props/BannerProps";

const bannerProps: BannerProps = {
  bannersService: {} as any,
  storage: {} as any,
  countryApiHost: "http://localhost",
};

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../general/banners/country-banners/CountryBanners", () => ({
  default: () => null,
}));

vi.mock("open-football-project-core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("open-football-project-core")>();
  return {
    ...actual,
    buildTeamTriviaSvg: vi.fn(() => ({
      svgString: "<svg></svg>",
      width: 800,
      height: 400,
      filename: "team-quiz.png",
    })),
  };
});

const mockGame = {
  isAvailable: true,
  teamId: 42,
  teamLogo: "https://example.com/logo.png",
  teamName: "FC Awesome",
  venue: "Dream Stadium",
  founded: 1990,
  season: 2025,
  hints: [
    { hintKey: "PLAYER" as const, description: "great_player_key", value: "John Doe" },
    { hintKey: "STAT" as const, description: "total_goals_key", value: "42" },
  ],
  options: ["FC Awesome", "United Stars", "City FC"],
};

describe("GuessTheTeam", () => {
  let newGameMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    newGameMock = vi.fn();
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders hints and options correctly", () => {
    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("quiz.hints")).toBeInTheDocument();
    expect(screen.getByText(/quiz.total_goals_key/)).toBeInTheDocument();
    expect(screen.getByText(/quiz.great_player_key/)).toBeInTheDocument();

    mockGame.options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("shows 'Wrong Option' message when an incorrect team is selected", () => {
    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    const wrongOption = screen.getByText("City FC");
    fireEvent.click(wrongOption);

    expect(screen.getByText(/quiz.wrong_opt/i)).toBeInTheDocument();
  });

  it("reveals team name when correct option is selected", () => {
    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    const correctOption = screen.getByText("FC Awesome");
    fireEvent.click(correctOption);

    expect(screen.getByText("🎉 FC Awesome")).toBeInTheDocument();
  });

  it("calls newGame when 'New Quiz' is clicked", () => {
    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}

        />
      </MemoryRouter>,
    );

    const button = screen.getByText(/quiz.new_quiz/i);
    fireEvent.click(button);

    expect(newGameMock).toHaveBeenCalled();
  });

  it("opens Twitter help link when 'Ask for Help' is clicked", () => {
    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    const twitterButton = screen.getByText(/common.ask_help/i);
    fireEvent.click(twitterButton);

    expect(window.open).toHaveBeenCalled();
    const callArg = (window.open as any).mock.calls[0][0];
    expect(callArg).toContain("https://twitter.com/intent/tweet");
  });

  it("renders the download button", () => {
    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /common\.download/i }),
    ).toBeInTheDocument();
  });

  it("download button triggers SVG generation and is not disabled by default", async () => {
    const { buildTeamTriviaSvg } = await import("open-football-project-core");

    render(
      <MemoryRouter>
        <GuessTheTeam
          game={mockGame}
          newGame={newGameMock}
          leagueName="Premier League"
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    const downloadButton = screen.getByRole("button", {
      name: /common\.download/i,
    });
    expect(downloadButton).not.toBeDisabled();

    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(buildTeamTriviaSvg).toHaveBeenCalled();
    });
  });
});
