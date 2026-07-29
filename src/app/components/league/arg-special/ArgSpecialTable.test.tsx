import { render, screen } from "@testing-library/react";
import ArgSpecialTable from "./ArgSpecialTable";
import { ArgLeagueEntry } from "@matchinsights/core";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ArgSpecialTable", () => {
  const mockAnnual: ArgLeagueEntry[] = [
    {
      teamId: 1,
      teamLogo: "logo1.png",
      teamName: "Team A",
      points: 30,
      played: 15,
      wins: 9,
      draws: 3,
      losses: 3,
      goalsFor: 25,
      goalsAgainst: 10,
    },
    {
      teamId: 2,
      teamLogo: "logo2.png",
      teamName: "Team B",
      points: 28,
      played: 15,
      wins: 8,
      draws: 4,
      losses: 3,
      goalsFor: 20,
      goalsAgainst: 12,
    },
  ];

  const mockPromedios: ArgLeagueEntry[] = [
    {
      teamId: 1,
      teamLogo: "logo1.png",
      teamName: "Team A",
      promedio: 2.331,
      points: 0,
      played: 0,
    },
    {
      teamId: 2,
      teamLogo: "logo2.png",
      teamName: "Team B",
      promedio: 1.834,
      points: 0,
      played: 0,
    },
  ];

  const renderWithRouter = (
    teams: ArgLeagueEntry[],
    mode: "annual" | "promedios"
  ) =>
    render(
      <MemoryRouter>
        <ArgSpecialTable teams={teams} mode={mode} />
      </MemoryRouter>
    );

  it("renders NoData when teams is empty", () => {
    renderWithRouter([], "annual");
    expect(screen.getByText(/nodata/i)).toBeInTheDocument();
  });

  it("renders annual table with correct columns and logos", () => {
    renderWithRouter(mockAnnual, "annual");

    mockAnnual.forEach((team) => {
      expect(screen.getByText(team.teamName)).toBeInTheDocument();
      expect(screen.getByAltText(team.teamName)).toHaveAttribute(
        "src",
        team.teamLogo
      );
      expect(screen.getByText(team.points!.toString())).toBeInTheDocument();
      expect(screen.getByText(team.wins!.toString())).toBeInTheDocument();
    });
  });

  it("renders promedios table with promedio column and logos", () => {
    renderWithRouter(mockPromedios, "promedios");

    mockPromedios.forEach((team) => {
      expect(screen.getByText(team.teamName)).toBeInTheDocument();
      expect(screen.getByAltText(team.teamName)).toHaveAttribute(
        "src",
        team.teamLogo
      );
      expect(screen.getByText(team.promedio!.toString())).toBeInTheDocument();
    });
  });

  it("renders team link correctly", () => {
    renderWithRouter(mockAnnual, "annual");

    mockAnnual.forEach((team) => {
      const link = screen.getByText(team.teamName).closest("a");
      expect(link).toHaveAttribute("href", `/team/${team.teamId}`);
    });
  });
});
