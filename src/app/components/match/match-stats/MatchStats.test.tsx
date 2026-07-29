import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";
import MatchStats from "./MatchStats";

import { mockTeamsStatistics } from "open-football-project-core";

vi.mock("../../general/no-data/NoData", () => ({
  default: () => <div data-testid="no-data">No Data</div>,
}));

describe("MatchStats Component", () => {
  it("renders both teams with stats correctly", () => {
    render(<MatchStats statistics={mockTeamsStatistics} />);

    expect(screen.getByText("Arsenal")).toBeDefined();
    expect(screen.getByText("Chelsea")).toBeDefined();

    expect(screen.getByTestId(`Arsenal-stat-0`)).toBeDefined();
    expect(screen.getByTestId(`Chelsea-stat-0`)).toBeDefined();
  });

  it("renders NoData if statistics are undefined", () => {
    render(
      <MatchStats
        statistics={{
          teamA: { statistics: [], teamId: -1, teamLogo: "", teamName: "" },
          teamB: { statistics: [], teamId: -1, teamLogo: "", teamName: "" },
        }}
      />
    );
    expect(screen.getByTestId("no-data")).toBeDefined();
  });
});
