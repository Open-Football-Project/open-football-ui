import { readFileSync, writeFileSync } from "fs";
import * as path from "path";
import { LeagueEntry } from "../types";

const leaguesJson = path.resolve("public/seo/leagues.json");
const outputHtml = path.resolve("public/seo/footer-snippet.html");

export function buildFooterHtml(leagues: LeagueEntry[]): string {
  const leagueCards = leagues
    .map(
      (league) => `
    <div style="background:#1E1E1E;border-radius:16px;padding:16px;border:1px solid rgba(255,255,255,0.05)">
      <a href="/league/${league.leagueId}" style="display:block;margin-bottom:12px;color:#FF6B00;font-weight:700;font-size:14px;text-decoration:none">${league.leagueName}</a>
      <ul style="list-style:none;padding:0;margin:0">
        ${league.teams
          .map(
            (team) =>
              `<li style="display:flex;align-items:center;gap:6px;margin-bottom:4px">` +
              `<span style="color:#FF6B00;font-size:12px">·</span>` +
              `<a href="/team/${team.teamId}" style="color:#E4E4E4;font-size:13px;text-decoration:none">${team.teamName}</a>` +
              `</li>`,
          )
          .join("")}
      </ul>
    </div>`,
    )
    .join("");

  return `
<footer id="seo-footer" style="display:none;position:relative;z-index:1;background:#142144;border-top:1px solid rgba(255,255,255,0.1);font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased">
  <div style="max-width:1280px;margin:0 auto;padding:48px 24px">
    <nav aria-label="Browse football leagues" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px;margin-bottom:48px">
      ${leagueCards}
    </nav>
    <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:24px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;font-size:13px;color:#B0B0B0">
      <span>© ${new Date().getFullYear()} futballero.com · All rights reserved</span>
      <div style="display:flex;flex-wrap:wrap;gap:16px">
        <a href="/privacy-policy.html" style="color:#B0B0B0;text-decoration:none">Privacy Policy</a>
        <a href="/about" style="color:#B0B0B0;text-decoration:none">About</a>
        <a href="/matches" style="color:#B0B0B0;text-decoration:none">Matches</a>
        <a href="https://www.instagram.com/futballerook" target="_blank" rel="noopener noreferrer" style="color:#B0B0B0;text-decoration:none">Instagram</a>
        <a href="https://x.com/futballeros" target="_blank" rel="noopener noreferrer" style="color:#B0B0B0;text-decoration:none">X</a>
        <a href="https://www.facebook.com/profile.php?id=61589186221200" target="_blank" rel="noopener noreferrer" style="color:#B0B0B0;text-decoration:none">Facebook</a>
      </div>
    </div>
  </div>
</footer>
`.trim();
}

if (require.main === module) {
  const leagues: LeagueEntry[] = JSON.parse(readFileSync(leaguesJson, "utf-8"));
  writeFileSync(outputHtml, buildFooterHtml(leagues));
  console.log("footer snippet → public/seo/footer-snippet.html");
}
