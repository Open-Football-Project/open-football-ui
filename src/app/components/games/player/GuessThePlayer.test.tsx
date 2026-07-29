import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GuessThePlayer from "./GuessThePlayer";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { BannerProps } from "../../../common-props/BannerProps";

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../general/banners/country-banners/CountryBanners", () => ({
  default: () => null,
}));

vi.mock("@matchinsights/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@matchinsights/core")>();
  return {
    ...actual,
    buildPlayerTriviaSvg: vi.fn(() => ({
      svgString: "<svg></svg>",
      width: 800,
      height: 400,
      filename: "player-quiz-forward.png",
    })),
  };
});

describe("GuessThePlayer Component", () => {
  const mockNewGame = vi.fn();
  const bannerProps: BannerProps = {
    bannersService: {} as any,
    storage: {} as any,
    countryApiHost: "http://localhost",
  };

  const mockGame = {
    isAvailable: true,
    playerId: 1,
    playerName: "Lionel Messi",
    playerPhoto: "/messi.jpg",
    playerNationality: "Argentina",
    playerPosition: "Forward",
    options: ["Lionel Messi", "Cristiano Ronaldo", "Neymar Jr"],
    hints: [
      {
        hintKey: "TRANSFER" as const,
        description: "Barcelona to PSG",
        transferFromTeam: "Barcelona",
        transferToTeam: "PSG",
        transferYear: 2021,
        transferFromLogo: "/barca.png",
        transferToLogo: "/psg.png",
      },
      {
        hintKey: "TROPHY" as const,
        description: "FIFA World Cup 2022",
        trophyLeague: "FIFA World Cup",
        trophySeason: "2022",
        trophyCountry: "QA",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).open;
    (window as any).open = vi.fn();
    Object.defineProperty(window, "location", {
      value: { href: "https://example.com/quiz" },
      writable: true,
    });
  });

  it("renders player hints", () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("quiz.hints")).toBeInTheDocument();
    expect(screen.getByText(/quiz.transfer/i)).toBeInTheDocument();
    expect(screen.getByText(/quiz.trophy/i)).toBeInTheDocument();
  });

  it("shows '?' when player not revealed", () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("reveals player details on correct selection", async () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText("Lionel Messi"));

    expect(await screen.findByText(/Lionel Messi/i)).toBeInTheDocument();
    expect(screen.queryByText("❌ quiz.wrong_opt")).not.toBeInTheDocument();
  });

  it("shows wrong guess message on incorrect selection", async () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText("Cristiano Ronaldo"));

    expect(await screen.findByText("❌ quiz.wrong_opt")).toBeInTheDocument();
  });

  it("calls newGame when clicking 'New Quiz' button", async () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText("quiz.new_quiz"));
    expect(mockNewGame).toHaveBeenCalledTimes(1);
  });

  it("opens Twitter intent on 'Ask for Help' click", async () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );
    const user = userEvent.setup();

    await user.click(screen.getByText("common.ask_help"));

    expect(window.open).toHaveBeenCalled();
    const [url] = (window.open as any).mock.calls[0];
    expect(url).toContain("https://twitter.com/intent/tweet");
  });

  it("renders the download button", () => {
    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
          bannerProps={bannerProps}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /common\.download/i }),
    ).toBeInTheDocument();
  });

  it("download button triggers SVG generation", async () => {
    const { buildPlayerTriviaSvg } = await import("@matchinsights/core");

    render(
      <MemoryRouter>
        <GuessThePlayer
          teamName="FC Barcelona"
          game={mockGame}
          newGame={mockNewGame}
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
      expect(buildPlayerTriviaSvg).toHaveBeenCalled();
    });
  });
});
