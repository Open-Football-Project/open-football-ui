/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MatchesGrid from "./MatchesGrid";
import type { ApiService, DayMatches, OnDayMatch } from "@matchinsights/core";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

vi.mock("../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" src={src} alt="league logo" />
  ),
}));

vi.mock("./day-matches/DayMatches", () => ({
  DayMatchesList: ({ matches }: { matches: any[] }) => (
    <div data-testid="day-matches-list">{matches.length} matches</div>
  ),
}));

vi.mock("../../../converter/svg-png-converter/svg-png-converter", () => ({
  svgToPng: vi.fn(),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    buildFixtureSvgString: vi.fn().mockReturnValue("<svg/>"),
    getFixtureSvgH: vi.fn().mockReturnValue(500),
    FIXTURE_SVG_W: 620,
    dayMatchesToFixtureRound: vi.fn().mockReturnValue({
      name: "2024-03-01",
      days: [{ date: "2024-03-01T20:00:00.000Z", matches: [] }],
    }),
  };
});

const makeMatch = (
  id: number,
  homeTeamName: string,
  awayTeamName: string,
  isFinished = false,
): OnDayMatch => ({
  fixtureId: id,
  homeTeamId: id * 10,
  awayTeamId: id * 10 + 1,
  homeTeamName,
  awayTeamName,
  homeTeamLogo: null,
  awayTeamLogo: null,
  homeTeamScore: isFinished ? 1 : null,
  awayTeamScore: isFinished ? 0 : null,
  isFinished,
  date: "2024-03-01T20:00:00.000Z",
  statusShort: isFinished ? "FT" : "NS",
  statusLong: isFinished ? "Match Finished" : "Not Started",
  isLiveNow: false,
});

const mockApiService = {} as unknown as ApiService;

const mockLeagueMatches: DayMatches[] = [
  {
    leagueId: 1,
    leagueName: "Premier League",
    leagueLogo: "premier.png",
    matches: [
      makeMatch(101, "Arsenal", "Chelsea"),
      makeMatch(102, "Liverpool", "Man City"),
    ],
  },
  {
    leagueId: 2,
    leagueName: "La Liga",
    leagueLogo: "laliga.png",
    matches: [makeMatch(201, "Barcelona", "Real Madrid", true)],
  },
];

describe("MatchesGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all leagues with correct names and logos", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Premier Lg.")).toBeInTheDocument();
    expect(screen.getByText("La Liga")).toBeInTheDocument();

    const logos = screen.getAllByTestId("logo") as HTMLImageElement[];
    expect(logos).toHaveLength(2);
    expect(logos[0].src).toContain("premier.png");
    expect(logos[1].src).toContain("laliga.png");
  });

  it("renders correct link URLs for each league", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/league/1");
    expect(links[1]).toHaveAttribute("href", "/league/2");
  });

  it("renders DayMatchesList with correct match counts", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    const dayMatchLists = screen.getAllByTestId("day-matches-list");
    expect(dayMatchLists).toHaveLength(2);
    expect(dayMatchLists[0]).toHaveTextContent("2 matches");
    expect(dayMatchLists[1]).toHaveTextContent("1 matches");
  });

  it("renders nothing if no leagues provided", () => {
    render(
      <MemoryRouter>
        <MatchesGrid leagueMatches={[]} apiService={mockApiService} />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Lg./i)).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("logo")).toHaveLength(0);
  });
});

describe("MatchesGrid – share on X", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("open", vi.fn());
  });

  it("renders a Share button for each league card", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("button", { name: /share/i })).toHaveLength(2);
  });

  it("opens a twitter intent URL when Share is clicked", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /share/i })[0]);

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining("twitter.com/intent/tweet"),
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("includes the correct league name and futballero.com in tweet text", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /share/i })[0]);

    const url = vi.mocked(window.open).mock.calls[0][0] as string;
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain("Premier League");
    expect(text).toContain("futballero.com");
  });

  it("uses 'vs' for upcoming matches and score for finished ones", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    // La Liga card (index 1) has a finished match
    fireEvent.click(screen.getAllByRole("button", { name: /share/i })[1]);

    const url = vi.mocked(window.open).mock.calls[0][0] as string;
    const text = decodeURIComponent(url.split("text=")[1]);
    expect(text).toContain("Barcelona 1-0 Real Madrid");
  });
});

describe("MatchesGrid – download", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(svgToPng).mockResolvedValue(undefined);
  });

  it("renders a Download button for each league card", () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("button", { name: /download/i })).toHaveLength(
      2,
    );
  });

  it("calls svgToPng with the correct filename on click", async () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /download/i })[0]);

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        "futballero-premier-lg.-matches.png",
        620,
        500,
      ),
    );
  });

  it("generates separate PNGs for each league card", async () => {
    render(
      <MemoryRouter>
        <MatchesGrid
          leagueMatches={mockLeagueMatches}
          apiService={mockApiService}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getAllByRole("button", { name: /download/i })[1]);

    await waitFor(() =>
      expect(svgToPng).toHaveBeenCalledWith(
        expect.any(Object),
        "futballero-la-liga-matches.png",
        620,
        500,
      ),
    );
  });
});
