import { describe, it, expect } from "vitest";
import { pickRandomSquadPlayers, selectFixtureIdsInWindow } from "./sitemap-selection";
import { SquadPlayer, FixtureRound } from "../types";

describe("pickRandomSquadPlayers", () => {
  const fullSquad: SquadPlayer[] = [
    { playerId: 1, position: "Goalkeeper" },
    { playerId: 2, position: "Goalkeeper" },
    { playerId: 3, position: "Defender" },
    { playerId: 4, position: "Defender" },
    { playerId: 5, position: "Midfielder" },
    { playerId: 6, position: "Midfielder" },
    { playerId: 7, position: "Attacker" },
    { playerId: 8, position: "Attacker" },
    { playerId: 9, position: "Attacker" },
  ];

  it("picks 2 attackers, 1 midfielder, 1 defender and 1 goalkeeper when all are available", () => {
    const picked = pickRandomSquadPlayers(fullSquad, () => 0);

    const byPosition = (position: string) =>
      picked.filter((p: SquadPlayer) => p.position === position);

    expect(byPosition("Attacker")).toHaveLength(2);
    expect(byPosition("Midfielder")).toHaveLength(1);
    expect(byPosition("Defender")).toHaveLength(1);
    expect(byPosition("Goalkeeper")).toHaveLength(1);
    expect(picked).toHaveLength(5);
  });

  it("never picks the same player twice", () => {
    const picked = pickRandomSquadPlayers(fullSquad, () => 0.5);
    const ids = picked.map((p: SquadPlayer) => p.playerId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("takes fewer players when a position bucket is short", () => {
    const thinSquad: SquadPlayer[] = [
      { playerId: 1, position: "Goalkeeper" },
      { playerId: 2, position: "Defender" },
      { playerId: 3, position: "Midfielder" },
      { playerId: 4, position: "Attacker" },
    ];

    const picked = pickRandomSquadPlayers(thinSquad, () => 0);

    expect(picked.filter((p: SquadPlayer) => p.position === "Attacker")).toHaveLength(1);
    expect(picked).toHaveLength(4);
  });

  it("returns an empty array for an empty squad", () => {
    expect(pickRandomSquadPlayers([], () => 0)).toEqual([]);
  });

  it("is deterministic for a given rng", () => {
    const rng = () => 0.1;
    const first = pickRandomSquadPlayers(fullSquad, rng);
    const second = pickRandomSquadPlayers(fullSquad, rng);
    expect(first.map((p: SquadPlayer) => p.playerId)).toEqual(
      second.map((p: SquadPlayer) => p.playerId)
    );
  });
});

describe("selectFixtureIdsInWindow", () => {
  const round = (fixtureIds: number[]): FixtureRound => ({
    days: [{ matches: fixtureIds.map((fixtureId) => ({ fixtureId })) }],
  });

  const rounds: FixtureRound[] = [
    round([1]),
    round([2]),
    round([3]),
    round([4]),
    round([5]),
    round([6]),
  ];

  it("collects fixtureIds from a window around currentRoundIndex", () => {
    const ids = selectFixtureIdsInWindow(rounds, 3, 1, 2);
    expect(ids).toEqual([3, 4, 5, 6]);
  });

  it("clamps the window at the start of the season", () => {
    const ids = selectFixtureIdsInWindow(rounds, 0, 1, 1);
    expect(ids).toEqual([1, 2]);
  });

  it("clamps the window at the end of the season", () => {
    const ids = selectFixtureIdsInWindow(rounds, 5, 1, 3);
    expect(ids).toEqual([5, 6]);
  });

  it("collects fixtureIds across multiple days and matches within a round", () => {
    const busyRounds: FixtureRound[] = [
      {
        days: [
          { matches: [{ fixtureId: 10 }, { fixtureId: 11 }] },
          { matches: [{ fixtureId: 12 }] },
        ],
      },
    ];

    expect(selectFixtureIdsInWindow(busyRounds, 0, 0, 0)).toEqual([10, 11, 12]);
  });

  it("returns an empty array for an empty rounds list", () => {
    expect(selectFixtureIdsInWindow([], 0, 1, 2)).toEqual([]);
  });
});
