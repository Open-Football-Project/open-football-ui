import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LeagueGroupCard from "./LeagueGroupCard";

vi.mock("../../league-table/LeagueTable", () => ({
  LeagueTable: ({ teams }: { teams: any[] }) => (
    <div data-testid="league-table">{`Teams: ${teams.length}`}</div>
  ),
}));

vi.mock("@matchinsights/core", async () => {
  const actual = await vi.importActual("@matchinsights/core");
  return {
    ...actual,
    leagueGroupTranslation: vi.fn(),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
  }),
}));

import { leagueGroupTranslation, LeagueGroup } from "@matchinsights/core";

const mockGroup: LeagueGroup = {
  label: "Group A",
  teams: [
    {
      teamId: 1,
      rank: 1,
      teamName: "Team One",
      logo: "logo.png",
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
};

describe("LeagueGroupCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (leagueGroupTranslation as any).mockReturnValue("GROUP A");
  });

  it("renders translated group title", () => {
    render(<LeagueGroupCard group={mockGroup} />);

    expect(leagueGroupTranslation).toHaveBeenCalledWith("Group A", "en");
    expect(screen.getByText("GROUP A")).toBeInTheDocument();
  });

  it("renders LeagueTable with correct teams", () => {
    render(<LeagueGroupCard group={mockGroup} />);

    const table = screen.getByTestId("league-table");
    expect(table).toHaveTextContent("Teams: 1");
  });

  it("handles missing group label gracefully", () => {
    render(
      <LeagueGroupCard
        group={{
          ...mockGroup,
          label: undefined,
        }}
      />
    );

    expect(leagueGroupTranslation).toHaveBeenCalledWith("", "en");
  });
});
