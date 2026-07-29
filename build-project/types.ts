export interface TeamEntry {
  teamId: number;
  teamName: string;
  playerIds: number[];
}

export interface LeagueEntry {
  leagueId: number;
  leagueName: string;
  teams: TeamEntry[];
  fixtureIds: number[];
}

export interface SquadPlayer {
  playerId: number;
  position?: string;
}

export interface FixtureMatch {
  fixtureId: number;
}

export interface FixtureDay {
  matches: FixtureMatch[];
}

export interface FixtureRound {
  days: FixtureDay[];
}

export const POSITION_QUOTAS: Record<string, number> = {
  Attacker: 2,
  Midfielder: 1,
  Defender: 1,
  Goalkeeper: 1,
};
