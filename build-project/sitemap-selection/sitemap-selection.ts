import { SquadPlayer, FixtureRound, POSITION_QUOTAS } from "../types";

function shuffle<T>(items: T[], rng: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickRandomSquadPlayers(
  squad: SquadPlayer[],
  rng: () => number = Math.random
): SquadPlayer[] {
  const picked: SquadPlayer[] = [];

  for (const [position, quota] of Object.entries(POSITION_QUOTAS)) {
    const pool = squad.filter((player) => player.position === position);
    picked.push(...shuffle(pool, rng).slice(0, quota));
  }

  return picked;
}

export function selectFixtureIdsInWindow(
  rounds: FixtureRound[],
  currentRoundIndex: number,
  roundsBefore = 1,
  roundsAfter = 2
): number[] {
  const start = Math.max(0, currentRoundIndex - roundsBefore);
  const end = Math.min(rounds.length - 1, currentRoundIndex + roundsAfter);

  const fixtureIds: number[] = [];
  for (let i = start; i <= end; i++) {
    for (const day of rounds[i]?.days ?? []) {
      for (const match of day.matches) {
        fixtureIds.push(match.fixtureId);
      }
    }
  }

  return fixtureIds;
}
