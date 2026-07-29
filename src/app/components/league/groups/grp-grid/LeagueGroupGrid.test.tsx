import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LeagueGroupGrid from "./LeagueGroupGrid";
import { LeagueGroup } from "open-football-project-core";

vi.mock("../grp-card/LeagueGroupCard", () => ({
  default: ({ group }: { group: LeagueGroup }) => (
    <div data-testid="group-card">{group.label}</div>
  ),
}));

const mockGroups: LeagueGroup[] = [
  {
    label: "Group A",
    teams: [
      {
        teamId: 1,
        rank: 1,
        teamName: "Team One",
        logo: "logo1.png",
        points: 10,
        played: 4,
        won: 3,
        draw: 1,
        lost: 0,
        goalsFor: 8,
        goalsAgainst: 2,
        form: "WWDW",
      },
    ],
  },
  {
    label: "Group B",
    teams: [
      {
        teamId: 2,
        rank: 1,
        teamName: "Team Two",
        logo: "logo2.png",
        points: 12,
        played: 4,
        won: 4,
        draw: 0,
        lost: 0,
        goalsFor: 10,
        goalsAgainst: 3,
        form: "WWWW",
      },
    ],
  },
];

describe("LeagueGroupGrid", () => {
  it("renders the correct number of group cards", () => {
    render(<LeagueGroupGrid groups={mockGroups} />);

    const groupCards = screen.getAllByTestId("group-card");
    expect(groupCards.length).toBe(mockGroups.length);
  });

  it("displays the group labels correctly", () => {
    render(<LeagueGroupGrid groups={mockGroups} />);

    mockGroups.forEach((group) => {
      expect(screen.getByText(group.label)).toBeInTheDocument();
    });
  });

  it("renders nothing if no groups are provided", () => {
    render(<LeagueGroupGrid groups={[]} />);

    const groupCards = screen.queryAllByTestId("group-card");
    expect(groupCards.length).toBe(0);
  });
});
