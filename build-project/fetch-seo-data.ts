import { writeFileSync, mkdirSync } from "fs";
import * as path from "path";
import { pickRandomSquadPlayers, selectFixtureIdsInWindow } from "./sitemap-selection/sitemap-selection";
import { ALL_LEAGUES } from "./tracked-leagues";
import { SquadPlayer, FixtureRound, TeamEntry, LeagueEntry } from "./types";

const API_BASE = "https://footballproject.org";
const OUTPUT_DIR = path.resolve("public/seo");

const LEAGUE_NAME_OVERRIDES: Record<number, string> = {
  71: "Serie A Brazil",
  135: "Serie A Italy",
};

async function fetchSquad(teamId: number): Promise<SquadPlayer[]> {
  try {
    const res = await fetch(`${API_BASE}/api/teams/squad/${teamId}`);
    if (!res.ok) return [];
    return (await res.json()) as SquadPlayer[];
  } catch (err) {
    console.warn(`    skipped squad for team ${teamId}:`, (err as Error).message);
    return [];
  }
}

async function fetchFixtureIds(leagueId: number): Promise<number[]> {
  try {
    const res = await fetch(`${API_BASE}/api/league/fixture/${leagueId}`);
    if (!res.ok) return [];

    const data = (await res.json()) as {
      rounds?: FixtureRound[];
      currentRoundIndex?: number;
    };
    const rounds = data.rounds ?? [];
    if (!rounds.length) return [];

    return selectFixtureIdsInWindow(rounds, data.currentRoundIndex ?? 0);
  } catch (err) {
    console.warn(`  skipped fixtures for league ${leagueId}:`, (err as Error).message);
    return [];
  }
}

async function fetchLeague(leagueId: number): Promise<LeagueEntry | null> {
  try {
    const res = await fetch(`${API_BASE}/api/league/standing/${leagueId}`);
    if (!res.ok) return null;

    const data = (await res.json()) as any;
    if (!data.group?.length) return null;

    const top5 = data.group
      .flatMap((g: any) => g.teams)
      .sort((a: any, b: any) => b.points - a.points || b.won - a.won)
      .filter((t: any, i: number, arr: any[]) => arr.findIndex((x) => x.teamId === t.teamId) === i)
      .slice(0, 5);

    const teams: TeamEntry[] = await Promise.all(
      top5.map(async (t: any) => {
        const squad = await fetchSquad(t.teamId);
        const players = pickRandomSquadPlayers(squad);
        return {
          teamId: t.teamId,
          teamName: t.teamName,
          playerIds: players.map((p) => p.playerId),
        };
      })
    );

    const fixtureIds = await fetchFixtureIds(leagueId);

    return {
      leagueId,
      leagueName: LEAGUE_NAME_OVERRIDES[leagueId] ?? data.name,
      teams,
      fixtureIds,
    };
  } catch (err) {
    console.warn(`  skipped league ${leagueId}:`, (err as Error).message);
    return null;
  }
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const results: LeagueEntry[] = [];

  for (const leagueId of ALL_LEAGUES) {
    process.stdout.write(`fetching league ${leagueId}...`);
    const entry = await fetchLeague(leagueId);
    if (entry) {
      results.push(entry);
      console.log(` ✓ ${entry.leagueName} (${entry.teams.length} teams, ${entry.fixtureIds.length} fixtures)`);
    } else {
      console.log(" ✗ no data");
    }
  }

  writeFileSync(
    path.join(OUTPUT_DIR, "leagues.json"),
    JSON.stringify(results, null, 2),
  );

  console.log(`\n${results.length} leagues → public/seo/leagues.json`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
