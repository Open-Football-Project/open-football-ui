import { describe, it, expect } from "vitest";
import { BetMarketInfo } from "@matchinsights/core";
import { marketToPanel, translateOutcomeLabel } from "./market-to-panel";

const translationDict: Record<string, string> = {
  "charts.marketOutcomes.home": "HOME_T",
  "charts.marketOutcomes.no_goal": "NO_GOAL_T",
  "charts.marketOutcomes.2": "WRONG_SHOULD_NOT_APPLY",
};

const t = (key: string, opts?: { defaultValue?: string }) => translationDict[key] ?? opts?.defaultValue ?? key;

describe("translateOutcomeLabel", () => {
  it("translates a recognized outcome label via the marketOutcomes dictionary", () => {
    expect(translateOutcomeLabel("Home", t)).toBe("HOME_T");
  });

  it("falls back to the raw label when the outcome label isn't in the dictionary", () => {
    expect(translateOutcomeLabel("Draw", t)).toBe("Draw");
  });

  it("never translates a numeric label, even if the dictionary happens to have an entry for it", () => {
    expect(translateOutcomeLabel("2", t)).toBe("2");
  });

  it("never translates a scoreline label", () => {
    expect(translateOutcomeLabel("1-0", t)).toBe("1-0");
  });

  it("does translate a non-numeric label like 'No goal' via the dictionary", () => {
    expect(translateOutcomeLabel("No goal", t)).toBe("NO_GOAL_T");
  });
});

describe("marketToPanel", () => {
  const market: BetMarketInfo = {
    id: 1,
    name: "fulltime_result",
    history: {
      Home: [{ minute: 5, odd: "1.50", capturedAt: "t" }],
      Draw: [{ minute: 5, odd: "3.20", capturedAt: "t" }],
    },
  };

  it("converts a market into an Odds-type ChartPanel with one line per history entry", () => {
    const panel = marketToPanel(market, "Arsenal", "Chelsea", t);

    expect(panel.type).toBe("odds");
    expect(panel.id).toBe(1);
    expect(panel.title).toBe("fulltime_result");
    expect(panel.homeTeamName).toBe("Arsenal");
    expect(panel.awayTeamName).toBe("Chelsea");
    expect(panel.points).toEqual([]);
    expect(panel.lines).toHaveLength(2);
    expect(panel.lines?.find((line) => line.label === "HOME_T")?.points).toEqual(market.history.Home);
  });
});
