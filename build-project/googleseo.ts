import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream, existsSync, readFileSync } from "fs";
import * as path from "path";
import { ALL_LEAGUES } from "./tracked-leagues";
import { LeagueEntry } from "./types";

const HOSTNAME = "https://futballero.com";
const lastmod = new Date().toISOString();

function readLeaguesData(): LeagueEntry[] {
  const leaguesPath = path.resolve("public/seo/leagues.json");
  if (!existsSync(leaguesPath)) return [];
  return JSON.parse(readFileSync(leaguesPath, "utf-8"));
}

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: HOSTNAME });

  const staticRoutes = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/live", changefreq: "hourly", priority: 0.9 },
    { url: "/charts", changefreq: "hourly", priority: 0.9 },
    { url: "/today-players", changefreq: "hourly", priority: 0.9 },
    { url: "/matches", changefreq: "daily", priority: 0.8 },
    { url: "/leaguesall", changefreq: "weekly", priority: 0.7 },
    { url: "/about", changefreq: "monthly", priority: 0.4 },
    { url: "/feedback", changefreq: "monthly", priority: 0.3 },
  ];

  staticRoutes.forEach((route) => sitemap.write({ ...route, lastmod }));

  ALL_LEAGUES.forEach((leagueId) => {
    sitemap.write({
      url: `/league/${leagueId}`,
      changefreq: "weekly",
      priority: 0.9,
      lastmod,
    });
    sitemap.write({
      url: `/league/special/${leagueId}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod,
    });
    sitemap.write({
      url: `/knockout/league/${leagueId}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod,
    });
    sitemap.write({
      url: `/groups/league/${leagueId}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod,
    });
    sitemap.write({
      url: `/guess/league/team/${leagueId}`,
      changefreq: "weekly",
      priority: 0.5,
      lastmod,
    });
  });

  const leagues = readLeaguesData();

  const teamIds = new Set<number>();
  const playerIds = new Set<number>();
  const fixtureIds = new Set<number>();

  leagues.forEach((league) => {
    league.teams.forEach((team) => {
      teamIds.add(team.teamId);
      team.playerIds.forEach((playerId) => playerIds.add(playerId));
    });
    league.fixtureIds.forEach((fixtureId) => fixtureIds.add(fixtureId));
  });

  teamIds.forEach((teamId) => {
    sitemap.write({
      url: `/team/${teamId}`,
      changefreq: "weekly",
      priority: 0.6,
      lastmod,
    });
  });

  playerIds.forEach((playerId) => {
    sitemap.write({
      url: `/player/${playerId}`,
      changefreq: "weekly",
      priority: 0.5,
      lastmod,
    });
  });

  fixtureIds.forEach((fixtureId) => {
    sitemap.write({
      url: `/match/${fixtureId}`,
      changefreq: "daily",
      priority: 0.7,
      lastmod,
    });
  });

  console.log(
    `  + ${teamIds.size} teams, ${playerIds.size} players, ${fixtureIds.size} matches from public/seo/leagues.json`
  );

  sitemap.end();

  const sitemapOutputPath = path.resolve("dist", "sitemap.xml");
  const buffer = await streamToPromise(sitemap);
  const writeStream = createWriteStream(sitemapOutputPath);
  writeStream.write(buffer);
  writeStream.end();

  console.log(`sitemap generated at ${sitemapOutputPath}`);
}

if (require.main === module) {
  generateSitemap().catch((err) => {
    console.error("failed to generate sitemap:", err);
    process.exit(1);
  });
}
