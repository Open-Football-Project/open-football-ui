import { describe, it, expect } from "vitest";
import { allowedLeagues, leagueWeights } from "./landing-data";

describe("allowed-leagues", () => {
  it("all entries have unique league IDs", () => {
    const ids = allowedLeagues.map((l) => l.leagueId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all entries have weight greater than 0", () => {
    for (const league of allowedLeagues) {
      expect(league.weight).toBeGreaterThan(0);
    }
  });

  it("leagueWeights Map has same size as allowedLeagues array", () => {
    expect(leagueWeights.size).toBe(allowedLeagues.length);
  });

  it("leagueWeights maps leagueId to its weight", () => {
    for (const league of allowedLeagues) {
      expect(leagueWeights.get(league.leagueId)).toBe(league.weight);
    }
  });

  it("contains Premier League with highest weight tier", () => {
    const pl = allowedLeagues.find((l) => l.leagueId === 39);
    expect(pl).toBeDefined();
    expect(pl!.weight).toBe(100);
  });

  it("contains Liga Profesional Argentina with highest weight tier", () => {
    const lpa = allowedLeagues.find((l) => l.leagueId === 128);
    expect(lpa).toBeDefined();
    expect(lpa!.weight).toBe(100);
  });

  it("second divisions have lower weight than first divisions", () => {
    const championship = allowedLeagues.find((l) => l.leagueId === 40);
    const premierLeague = allowedLeagues.find((l) => l.leagueId === 39);
    expect(championship!.weight).toBeLessThan(premierLeague!.weight);
  });
});
