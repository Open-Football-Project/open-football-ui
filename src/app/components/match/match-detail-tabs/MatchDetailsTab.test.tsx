import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MatchDetailsTabs from "./MatchDetailsTabs";
import { TeamsLineups } from "@matchinsights/core";

vi.mock("../../general/no-data/NoData", () => ({
  default: () => <div data-testid="no-data">No Data</div>,
}));

vi.mock("../match-events-table/MatchEventsTable", () => ({
  default: ({ events }: { events: any[] }) => (
    <div data-testid="events-table">Events: {events.length}</div>
  ),
}));

vi.mock("../match-stats/MatchStats", () => ({
  default: ({ statistics }: { statistics: any }) => (
    <div data-testid="match-stats">
      Stats A:{statistics.teamA ? "Y" : "N"} | B:{statistics.teamB ? "Y" : "N"}
    </div>
  ),
}));

vi.mock("../match-lineups/MatchLineups", () => ({
  default: ({ lineups }: { lineups?: any }) => (
    <div data-testid="match-lineups">
      Lineup A:{lineups?.teamA ? "Y" : "N"} | B:{lineups?.teamB ? "Y" : "N"}
    </div>
  ),
}));

describe("MatchDetailsTabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders NoData", () => {
    render(
      <MatchDetailsTabs
        matchEvents={[]}
        liveStats={undefined}
        liveLineups={undefined}
      />
    );

    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("renders events tab by default when events exist", () => {
    const mockEvents = [
      { id: 1, timeElapsed: 10 },
      { id: 2, timeElapsed: 20 },
    ];

    render(
      <MatchDetailsTabs
        matchEvents={mockEvents}
        liveStats={undefined}
        liveLineups={undefined}
      />
    );

    expect(screen.getByText("detailtabs.events")).toBeInTheDocument();
    expect(screen.getByTestId("events-table")).toHaveTextContent("Events: 2");
  });

  it("renders stats tab by default when only stats exist", () => {
    const mockStats = { teamA: {}, teamB: {} } as LiveStatistics;

    render(
      <MatchDetailsTabs
        matchEvents={[]}
        liveStats={mockStats}
        liveLineups={undefined}
      />
    );

    expect(screen.getByText("detailtabs.stats")).toBeInTheDocument();
    expect(screen.getByTestId("match-stats")).toBeInTheDocument();
  });

  it("renders lineups tab by default when only lineups exist", () => {
    const mockLineups = { teamA: {}, teamB: {} } as TeamsLineups;

    render(
      <MatchDetailsTabs
        sortedEvents={undefined}
        liveStats={undefined}
        liveLineups={mockLineups}
      />
    );

    expect(screen.getByText("detailtabs.lineups")).toBeInTheDocument();
    expect(screen.getByTestId("match-lineups")).toBeInTheDocument();
  });

  it("switches to stats tab when clicked", () => {
    const mockEvents = [{ id: 1 }];
    const mockStats = { teamA: {}, teamB: {} };

    render(<MatchDetailsTabs matchEvents={mockEvents} liveStats={mockStats} />);

    const statsTab = screen.getByText("detailtabs.stats");
    fireEvent.click(statsTab);

    expect(screen.getByTestId("match-stats")).toBeInTheDocument();
    expect(screen.queryByTestId("events-table")).not.toBeInTheDocument();
  });

  it("does not crash when liveStats is undefined", () => {
    const mockEvents = [{ id: 1 }];

    render(<MatchDetailsTabs matchEvents={mockEvents} liveStats={undefined} />);

    expect(screen.getByTestId("events-table")).toBeInTheDocument();
  });
});
