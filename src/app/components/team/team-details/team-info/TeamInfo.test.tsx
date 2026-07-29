import { render, screen } from "@testing-library/react";
import TeamInfo from "./TeamInfo";
import type { TeamDetails } from "open-football-project-core";
import { LeagueBasicInfo } from "open-football-project-core";
import { MemoryRouter } from "react-router-dom";

describe("TeamInfo", () => {
  const baseTeam: TeamDetails = {
    teamName: "Newcastle",
    teamLogo: "https://example.com/logo.png",
    teamCountry: "England",
    teamFounded: 1892,
    venueName: "St. James' Park",
    venueCity: "Newcastle upon Tyne",
    venueCapacity: 52758,
    coachName: "E. Howe",
    coachAge: 48,
  };

  const teamLeagues: LeagueBasicInfo[] = [
    {
      id: 1,
      name: "Premier League",
      logo: "https://example.com/premier-league-logo.png",
      type: "League",
    },
  ];

  it("renders the team name and country", () => {
    render(
      <MemoryRouter>
        <TeamInfo
          teamDetails={baseTeam}
          teamLeagues={[]}
          isTeamLeaguesAvailable={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Newcastle")).toBeInTheDocument();
    expect(screen.getByText(/England • common.founded/)).toBeInTheDocument();
  });

  it("renders founded year when valid", () => {
    render(
      <MemoryRouter>
        <TeamInfo
          teamDetails={baseTeam}
          teamLeagues={[]}
          isTeamLeaguesAvailable={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/1892/)).toBeInTheDocument();
  });

  it("renders 'Unknown' if founded year is invalid", () => {
    const team = { ...baseTeam, teamFounded: -1 };
    render(
      <MemoryRouter>
        <TeamInfo
          teamDetails={team}
          teamLeagues={[]}
          isTeamLeaguesAvailable={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/common.founded/)).toBeInTheDocument();
  });

  it("renders team available leagues", () => {
    const team = { ...baseTeam, teamFounded: -1 };
    render(
      <MemoryRouter>
        <TeamInfo
          teamDetails={team}
          teamLeagues={teamLeagues}
          isTeamLeaguesAvailable={true}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Premier Lg./)).toBeInTheDocument();
  });

  it("falls back to TeamLogo icon when no logo provided", () => {
    const team = { ...baseTeam, teamLogo: "" };
    render(
      <MemoryRouter>
        <TeamInfo
          teamDetails={team}
          teamLeagues={[]}
          isTeamLeaguesAvailable={false}
        />
      </MemoryRouter>
    );
    expect(screen.getByTestId("shield-fallback")).toBeInTheDocument();
  });
});
