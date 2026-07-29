import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HeadToHead from "./HeadToHead";
import { H2HDetails } from "open-football-project-core";

vi.mock("../../../general/no-data/NoData", () => ({
  default: ({ loading }: { loading?: boolean }) => (
    <div data-testid="no-data">{loading ? "Loading..." : "No Data"}</div>
  ),
}));

vi.mock("../../../general/tiny-card/TinyCard", () => ({
  default: ({ title, sections }: any) => (
    <div data-testid={`tinycard-${title}`}>
      <h2>{title}</h2>
      {sections.map((s: any, idx: number) => (
        <div key={idx}>{s.component}</div>
      ))}
    </div>
  ),
}));

describe("HeadToHead Component", () => {
  const mockH2H: H2HDetails = {
    date: "2025-09-30",
    winner: "HomeTeam",
    venue: { name: "Stadium A" },
    leagueName: "Premier League",
    season: 2025,
    round: "Round 5",
    homeHalfTimeGoal: 1,
    awayHalfTimeGoal: 0,
    homeFullTimeGoal: 2,
    awayFullTimeGoal: 1,
    homeExtraTimeGoal: 0,
    awayExtraTimeGoal: 0,
    homePenalty: 0,
    awayPenalty: 0,
  };

  it("renders loading state", () => {
    render(<HeadToHead h2hDetails={null} loading={true} />);
    expect(screen.getByTestId("no-data")).toHaveTextContent("Loading...");
  });

  it("renders NoData when h2hDetails is null and loading is false", () => {
    render(<HeadToHead h2hDetails={null} loading={false} />);
    expect(screen.getByTestId("no-data")).toHaveTextContent("No Data");
  });

  it("renders three TinyCards with correct content when h2hDetails is provided", () => {
    render(<HeadToHead h2hDetails={mockH2H} loading={false} />);

    expect(
      screen.getByTestId("tinycard-common.league_info")
    ).toBeInTheDocument();
    expect(screen.getByTestId("tinycard-common.main_info")).toBeInTheDocument();
    expect(
      screen.getByTestId("tinycard-common.score_info")
    ).toBeInTheDocument();

    expect(screen.getByText(/common.date:/)).toBeInTheDocument();
    expect(screen.getByText(/common.winner:/)).toBeInTheDocument();

    expect(screen.getByText(/common.venue:/)).toBeInTheDocument();
    expect(screen.getByText(/common.league:/)).toBeInTheDocument();
    expect(screen.getByText(/common.season:/)).toBeInTheDocument();
    expect(screen.getByText(/common.round:/)).toBeInTheDocument();

    expect(screen.getByText(/common.half_time:/)).toBeInTheDocument();
    expect(screen.getByText(/common.full_time:/)).toBeInTheDocument();
    expect(screen.getByText(/common.extra_time:/)).toBeInTheDocument();
    expect(screen.getByText(/common.penalties:/)).toBeInTheDocument();
  });
});
