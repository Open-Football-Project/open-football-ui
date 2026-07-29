import { describe, it, expect } from "vitest";
import { buildFooterHtml } from "./generate-seo-footer";
import { LeagueEntry } from "../types";

describe("buildFooterHtml", () => {
  const leagues: LeagueEntry[] = [
    {
      leagueId: 39,
      leagueName: "Premier League",
      fixtureIds: [],
      teams: [
        { teamId: 33, teamName: "Manchester United", playerIds: [] },
        { teamId: 40, teamName: "Liverpool", playerIds: [] },
      ],
    },
  ];

  it("links to each league page", () => {
    const html = buildFooterHtml(leagues);
    expect(html).toContain('href="/league/39"');
    expect(html).toContain("Premier League");
  });

  it("links to each team page under its league", () => {
    const html = buildFooterHtml(leagues);
    expect(html).toContain('href="/team/33"');
    expect(html).toContain("Manchester United");
    expect(html).toContain('href="/team/40"');
    expect(html).toContain("Liverpool");
  });

  it("includes the footer landmark and static nav links", () => {
    const html = buildFooterHtml(leagues);
    expect(html).toContain('id="seo-footer"');
    expect(html).toContain('href="/privacy-policy.html"');
    expect(html).toContain('href="/about"');
  });

  it("renders no team cards for an empty leagues list", () => {
    const html = buildFooterHtml([]);
    expect(html).toContain('id="seo-footer"');
    expect(html).not.toContain('href="/league/');
  });
});
