import { describe, it, expect, vi } from "vitest";
import type { TFunction } from "i18next";

vi.mock("open-football-project-core", () => ({
  translateCountry: (_rawCountry: string, _t: any) => "World",
}));

import matchSeoData from "./match-metadata";
import leagueSeoData from "./league-metadata";
import matchesSeoData from "./matches-metadata";
import leaguesAllSeoData from "./leaguesall-metadata";
import liveNowSeoData from "./livenow-metadata";
import chartsSeoData from "./charts-metadata";
import todayPlayersSeoData from "./today-players-metadata";
import teamSeoData from "./team-metadata";
import aboutSeoData from "./about-metadata";
import landingSeoData from "./landing-metadata";

const t = ((key: string) => key) as unknown as TFunction<"translation", undefined>;

describe("match-metadata jsonLd", () => {
  it("accepts startDate as a parameter and uses it in the schema", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
    );
    expect((result.jsonLd as any).startDate).toBe("2026-04-10T20:00:00Z");
  });

  it("organizer url is the site root, not the match url", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
    );
    expect((result.jsonLd as any).organizer.url).toBe("https://footballproject.org");
  });

  it("homeTeam and awayTeam are SportsTeam schema objects", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
    );
    expect((result.jsonLd as any).homeTeam).toEqual({ "@type": "SportsTeam", name: "HomeTeam" });
    expect((result.jsonLd as any).awayTeam).toEqual({ "@type": "SportsTeam", name: "AwayTeam" });
  });

  it("uses the real venue name and city in location when both are provided", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
      { name: "Old Trafford", city: "Manchester" },
    );
    expect((result.jsonLd as any).location.name).toBe("Old Trafford, Manchester");
  });

  it("uses just the venue name when city is missing", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
      { name: "Old Trafford" },
    );
    expect((result.jsonLd as any).location.name).toBe("Old Trafford");
  });

  it("uses just the venue city when name is missing", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
      { city: "Manchester" },
    );
    expect((result.jsonLd as any).location.name).toBe("Manchester");
  });

  it("falls back to the translated placeholder when venue has neither name nor city", () => {
    const result = matchSeoData(
      123,
      "HomeTeam",
      "AwayTeam",
      "2026-04-10T20:00:00Z",
      t,
    );
    expect((result.jsonLd as any).location.name).toBe("matchseo.jsonld.location");
  });
});

describe("league-metadata jsonLd", () => {
  it("type is SportsOrganization, not SportsEvent", () => {
    const result = leagueSeoData(1, "Premier League", t);
    expect((result.jsonLd as any)["@type"]).toBe("SportsOrganization");
  });

  it("has no startDate", () => {
    const result = leagueSeoData(1, "Premier League", t);
    expect((result.jsonLd as any).startDate).toBeUndefined();
  });

  it("has no organizer", () => {
    const result = leagueSeoData(1, "Premier League", t);
    expect((result.jsonLd as any).organizer).toBeUndefined();
  });
});

describe("matches-metadata jsonLd", () => {
  it("type is CollectionPage, not SportsEvent", () => {
    const result = matchesSeoData("2026-04-03", "World", t);
    expect((result.jsonLd as any)["@type"]).toBe("CollectionPage");
  });

  it("has no startDate", () => {
    const result = matchesSeoData("2026-04-03", "World", t);
    expect((result.jsonLd as any).startDate).toBeUndefined();
  });

  it("publisher url is the site root", () => {
    const result = matchesSeoData("2026-04-03", "World", t);
    expect((result.jsonLd as any).publisher.url).toBe("https://footballproject.org");
  });
});

describe("leaguesall-metadata jsonLd", () => {
  it("has no sport property", () => {
    const result = leaguesAllSeoData(t);
    expect((result.jsonLd as any).sport).toBeUndefined();
  });

  it("has no startDate", () => {
    const result = leaguesAllSeoData(t);
    expect((result.jsonLd as any).startDate).toBeUndefined();
  });

  it("publisher url is the site root, not the page url", () => {
    const result = leaguesAllSeoData(t);
    expect((result.jsonLd as any).publisher.url).toBe("https://footballproject.org");
  });
});

describe("livenow-metadata jsonLd", () => {
  it("has no hardcoded startDate", () => {
    const result = liveNowSeoData(undefined, t);
    expect((result.jsonLd as any).startDate).toBeUndefined();
  });
});

describe("charts-metadata jsonLd", () => {
  it("has no hardcoded startDate", () => {
    const result = chartsSeoData(undefined, t);
    expect((result.jsonLd as any).startDate).toBeUndefined();
  });

  it("url points at /charts when no fixtureId is given", () => {
    const result = chartsSeoData(undefined, t);
    expect(result.url).toBe("https://footballproject.org/charts");
  });

  it("url points at /charts/:fixtureId when a fixtureId is given", () => {
    const result = chartsSeoData("123", t);
    expect(result.url).toBe("https://footballproject.org/charts/123");
  });
});

describe("today-players-metadata jsonLd", () => {
  it("has no hardcoded startDate", () => {
    const result = todayPlayersSeoData(undefined, t);
    expect((result.jsonLd as any).startDate).toBeUndefined();
  });

  it("url points at /today-players when no fixtureId is given", () => {
    const result = todayPlayersSeoData(undefined, t);
    expect(result.url).toBe("https://footballproject.org/today-players");
  });

  it("url points at /today-players/:fixtureId when a fixtureId is given", () => {
    const result = todayPlayersSeoData("123", t);
    expect(result.url).toBe("https://footballproject.org/today-players/123");
  });
});

describe("team-metadata jsonLd", () => {
  it("has no memberOf linking the team to the website", () => {
    const result = teamSeoData(1, "FC Barcelona", t);
    expect((result.jsonLd as any).memberOf).toBeUndefined();
  });
});

describe("about-metadata jsonLd", () => {
  it("publisher url is the site root, not the about page url", () => {
    const result = aboutSeoData(t);
    expect((result.jsonLd as any).publisher.url).toBe("https://footballproject.org");
  });
});

const mockMatches = [
  {
    leagueId: 39,
    leagueName: "Premier League",
    leagueLogo: "premier.png",
    matches: [
      { fixtureId: 101, homeTeamName: "Arsenal", awayTeamName: "Chelsea", date: "2026-04-17T15:00:00Z" },
      { fixtureId: 102, homeTeamName: "Liverpool", awayTeamName: "Man City", date: "2026-04-17T17:30:00Z" },
    ],
  },
  {
    leagueId: 140,
    leagueName: "La Liga",
    leagueLogo: "laliga.png",
    matches: [
      { fixtureId: 201, homeTeamName: "Barcelona", awayTeamName: "Real Madrid", date: "2026-04-17T20:00:00Z" },
    ],
  },
];

describe("landing-metadata jsonLd", () => {
  it("returns WebPage jsonLd when no matches provided", () => {
    const result = landingSeoData(t, []);
    const jsonLd = result.jsonLd as any;
    expect(jsonLd["@type"]).toBe("WebPage");
  });

  it("returns array with WebPage and SportsEvent list when matches provided", () => {
    const result = landingSeoData(t, [], mockMatches as any);
    const jsonLd = result.jsonLd as any[];
    expect(Array.isArray(jsonLd)).toBe(true);
    const sportsEvents = jsonLd.find((s) => s["@type"] === "ItemList" && s.name === "Today's Matches");
    expect(sportsEvents).toBeDefined();
  });

  it("SportsEvent items contain match details", () => {
    const result = landingSeoData(t, [], mockMatches as any);
    const jsonLd = result.jsonLd as any[];
    const matchList = jsonLd.find((s) => s["@type"] === "ItemList" && s.name === "Today's Matches");
    expect(matchList.itemListElement).toHaveLength(3);
    expect(matchList.itemListElement[0].item["@type"]).toBe("SportsEvent");
    expect(matchList.itemListElement[0].item.homeTeam.name).toBe("Arsenal");
    expect(matchList.itemListElement[0].item.awayTeam.name).toBe("Chelsea");
  });
});
