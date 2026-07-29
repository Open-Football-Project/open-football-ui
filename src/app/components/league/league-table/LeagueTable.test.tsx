import { render, screen,  } from "@testing-library/react";
import { MutableRefObject } from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect,vi, afterEach } from "vitest";
import { LeagueTable } from "./LeagueTable";
import { LeagueTeamInfo } from "@matchinsights/core";
import * as rovingTabIndex from "../../../special-hooks/roving-tabindex/roving-tabindex";

const mockTeams: LeagueTeamInfo[] = [
  {
    rank: 1,
    teamId: 21,
    teamName: "Team One",
    logo: "/logo1.png",
    points: 30,
    played: 12,
    won: 9,
    draw: 3,
    lost: 0,
    goalsFor: 25,
    goalsAgainst: 10,
    form: "WWD",
  },
  {
    rank: 2,
    teamId: 22,
    teamName: "Team Two",
    logo: "/logo2.png",
    points: 28,
    played: 12,
    won: 8,
    draw: 4,
    lost: 0,
    goalsFor: 20,
    goalsAgainst: 8,
    form: "DLW",
  },
];

describe("LeagueTable Component", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders NoData when teams array is empty", () => {
    render(<LeagueTable teams={[]} />);
    expect(screen.getByText(/nodata.default/i)).toBeInTheDocument();
  });

  it("renders table rows with correct team info", () => {
    render(
      <BrowserRouter>
        <LeagueTable teams={mockTeams} />
      </BrowserRouter>
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText("Team One")).toBeInTheDocument();
    expect(screen.getByText("Team Two")).toBeInTheDocument();

    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("28")).toBeInTheDocument();

    expect(screen.getByText("9")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("renders form spans with correct colors", () => {
    render(
      <BrowserRouter>
        <LeagueTable teams={mockTeams} />
      </BrowserRouter>
    );

    const teamOneFormSpans = screen.getAllByTitle("W").slice(0, 2);
    const teamOneDrawSpan = screen.getAllByTitle("D")[0];

    teamOneFormSpans.forEach((span) =>
      expect(span).toHaveClass("bg-green-500")
    );
    expect(teamOneDrawSpan).toHaveClass("bg-yellow-400");

    const teamTwoDrawSpan = screen.getAllByTitle("D")[1];
    const teamTwoLossSpan = screen.getAllByTitle("L")[0];
    const teamTwoWinSpan = screen.getAllByTitle("W")[2];

    expect(teamTwoLossSpan).toHaveClass("bg-red-500");
    expect(teamTwoDrawSpan).toHaveClass("bg-yellow-400");
    expect(teamTwoWinSpan).toHaveClass("bg-green-500");
  });

  it("renders links with correct hrefs", () => {
    render(
      <BrowserRouter>
        <LeagueTable teams={mockTeams} />
      </BrowserRouter>
    );

    const teamOneLink = screen.getByText("Team One").closest("a");
    const teamTwoLink = screen.getByText("Team Two").closest("a");

    expect(teamOneLink).toHaveAttribute("href", "/team/21");
    expect(teamTwoLink).toHaveAttribute("href", "/team/22");
  });

  it("should not accumulate focusable refs on re-render", () => {
    let capturedRef: MutableRefObject<(HTMLElement | null)[]> | null = null;

    vi.spyOn(rovingTabIndex, "useRovingTabIndex").mockImplementation((ref) => {
      capturedRef = ref;
      return { onFocus: vi.fn(), handleKeyDown: vi.fn() };
    });

    const { rerender } = render(
      <BrowserRouter>
        <LeagueTable teams={mockTeams} />
      </BrowserRouter>
    );

    rerender(
      <BrowserRouter>
        <LeagueTable teams={mockTeams} />
      </BrowserRouter>
    );

    expect(capturedRef!.current.length).toBe(mockTeams.length);
  });
});
