import { describe, it, expect, vi, beforeEach } from "vitest";
import { MutableRefObject } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DayMatchesList } from "./DayMatches";
import { ApiService } from "@matchinsights/core";
import { useRovingTabIndex } from "../../../../special-hooks/roving-tabindex/roving-tabindex";

vi.mock("../../../../special-hooks/roving-tabindex/roving-tabindex", () => ({
  useRovingTabIndex: vi.fn(() => ({ onFocus: vi.fn(), handleKeyDown: vi.fn() })),
}));

vi.mock("../../../general/logo/Logo", () => ({
  default: ({ src }: { src: string }) => (
    <img data-testid="logo" src={src} alt="team logo" />
  ),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    getFormattedTime: vi.fn(() => "12:00"),
    getFormattedDate: vi.fn(() => "2025-10-21"),
  };
});

const mockApiService = {
  chartsService: {
    fetchFixtureIndicators: vi.fn().mockResolvedValue({}),
    fetchOddsFixtures: vi.fn().mockResolvedValue([]),
  },
  playerService: {
    fetchTodayPlayersFixtureIds: vi.fn().mockResolvedValue([]),
  },
} as unknown as ApiService;

const mockMatches = [
  {
    fixtureId: 0,
    homeTeamName: "team-a",
    awayTeamName: "team-b",
    homeTeamLogo: "arsenal.png",
    awayTeamLogo: "chelsea.png",
    homeTeamScore: 2,
    awayTeamScore: 1,
    isFinished: false,
    date: "2025-10-11T15:00:00Z",
    isLiveNow: false,
  },
  {
    fixtureId: 1,
    homeTeamName: "Arsenal",
    awayTeamName: "Chelsea",
    homeTeamLogo: "arsenal.png",
    awayTeamLogo: "chelsea.png",
    homeTeamScore: 2,
    awayTeamScore: 1,
    isFinished: true,
    date: "2025-10-11T15:00:00Z",
    isLiveNow: false,
  },
  {
    fixtureId: 2,
    homeTeamName: "Real Madrid",
    awayTeamName: "Barcelona",
    homeTeamLogo: "rm.png",
    awayTeamLogo: "barca.png",
    homeTeamScore: 0,
    awayTeamScore: 0,
    isFinished: false,
    date: "2025-10-12T18:00:00Z",
    isLiveNow: true,
  },
];

describe("DayMatchesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all matches with correct team names", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    expect(screen.getByText("Arsenal")).toBeInTheDocument();
    expect(screen.getByText("Chelsea")).toBeInTheDocument();
    expect(screen.getByText("Real Madrid")).toBeInTheDocument();
    expect(screen.getByText("Barcelona")).toBeInTheDocument();
  });

  it("displays scores for finished matches and '-' for ongoing ones", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    expect(screen.getByText("2 - 1")).toBeInTheDocument();

    expect(screen.getAllByText("-")[0]).toBeInTheDocument();
  });

  it("renders formatted time for non-finished matches", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("12:00").length).toEqual(2);
  });

  it("renders live-now-link for live matches", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("live-now-link")).toBeInTheDocument();
  });

  it("renders correct links for each match", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);

    expect(links[0]).toHaveAttribute("href", "/match/0");
    expect(links[1]).toHaveAttribute("href", "/match/1");
    expect(links[2]).toHaveAttribute("href", "/live/2");
  });

  it("renders two logos per match (home & away)", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    const logos = screen.getAllByTestId("logo");
    expect(logos).toHaveLength(6);
    expect(logos[0].src).toContain("arsenal.png");
    expect(logos[1].src).toContain("chelsea.png");
  });

  it("renders nothing if no matches are provided", () => {
    render(
      <MemoryRouter>
        <DayMatchesList matches={[]} apiService={mockApiService} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Arsenal/i)).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("logo")).toHaveLength(0);
  });

  it("passes allFocusable ref with one entry per match to useRovingTabIndex", () => {
    let capturedRef: MutableRefObject<(HTMLElement | null)[]> | null = null;

    vi.mocked(useRovingTabIndex).mockImplementation((ref) => {
      capturedRef = ref as MutableRefObject<(HTMLElement | null)[]>;
      return { onFocus: vi.fn(), handleKeyDown: vi.fn() };
    });

    render(
      <MemoryRouter>
        <DayMatchesList matches={mockMatches} apiService={mockApiService} />
      </MemoryRouter>
    );

    expect(capturedRef!.current.length).toBe(mockMatches.length);
  });
});
