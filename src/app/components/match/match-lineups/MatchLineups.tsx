import {
  TeamsLineups,
  LineupPlayer,
  buildMatchLineupsSvgString,
  MATCH_LINEUPS_SVG_W,
  MATCH_LINEUPS_SVG_H,
} from "@matchinsights/core";
import Logo from "../../../components/general/logo/Logo";
import NoData from "../../../components/general/no-data/NoData";
import pitch from "../../../assets/images/pitch.png";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

interface TeamsLineupsProps {
  lineups: TeamsLineups;
}

const HOME_LINE_TOP = [10, 20, 33, 44];
const AWAY_LINE_TOP = [90, 76, 65, 56];

const HOME_COLOR = '#0f2150ff';
const AWAY_COLOR = '#c20202ff';

const positionToLine = (pos: string) => {
  if (!pos) return 3;
  const p = pos.toLowerCase();
  if (p.includes("g")) return 0;
  if (p.includes("d")) return 1;
  if (p.includes("m")) return 2;
  return 3;
};

const groupByLine = (
  players: LineupPlayer[],
  customPositionToLine?: (pos: string) => number,
) => {
  const lines: Record<number, LineupPlayer[]> = {};
  players.forEach((p) => {
    const line = customPositionToLine
      ? customPositionToLine(p.pos)
      : positionToLine(p.pos);
    if (!lines[line]) lines[line] = [];
    lines[line].push(p);
  });
  return lines;
};

const onePlayerLeftPercent = () => 50;
const twoPlayersLeftPercent = (index: number) => {
  switch (index) {
    case 0:
      return 25;
    default:
      return 75;
  }
};

const threePlayersLeftPercent = (index: number) => {
  switch (index) {
    case 0:
      return 25;
    case 1:
      return 50;
    default:
      return 75;
  }
};

const getLeftPercent = (index: number, total: number) => {
  const padding = 12;
  switch (total) {
    case 1:
      return onePlayerLeftPercent();
    case 2:
      return twoPlayersLeftPercent(index);
    case 3:
      return threePlayersLeftPercent(index);
    default:
      return (index / (total - 1)) * (100 - 2 * padding) + padding;
  }
};

const MatchLineups = ({ lineups }: TeamsLineupsProps) => {
  const { teamA, teamB } = lineups;

  if (!teamA || !teamB || !teamA.lineup.length || !teamB.lineup.length)
    return <NoData />;

  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!teamA || !teamB || downloading) return;
    setDownloading(true);
    try {
      const svgString = buildMatchLineupsSvgString(
        teamA,
        teamB,
        getLeftPercent,
        groupByLine,
        positionToLine,
      );
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const filename = `${teamA.teamName}-vs-${teamB.teamName}-lineups.png`
        .replace(/\s+/g, "-")
        .toLowerCase();
      await svgToPng(svgEl, filename, MATCH_LINEUPS_SVG_W, MATCH_LINEUPS_SVG_H);
    } finally {
      setDownloading(false);
    }
  }, [teamA, teamB, downloading]);
  const teamALines = groupByLine(teamA.lineup);
  const teamBLines = groupByLine(teamB.lineup);

  const PlayerMarker = ({
    player,
    top,
    left,
    color,
  }: {
    player: LineupPlayer;
    top: number;
    left: number;
    color: string;
  }) => (
    <div
      key={`${player.name}-${player.number}`}
      style={{
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        transform: "translate(-50%, -50%)",
      }}
      className="flex flex-col items-center text-center z-10"
    >
      <div
        className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs text-white shadow-md`}
        style={{ backgroundColor: color }}
      >
        {player.number}
      </div>
      <span className="max-w-[50px] text-[8px] sm:text-[11px] text-brand-white uppercase m-1 drop-shadow">
        {player.name}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-md md:max-w-6xl mx-auto flex flex-col gap-4">
      <div className="flex justify-center">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-brand-yellow text-brand-darkBg text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {downloading
            ? "…"
            : t("common.download", { defaultValue: "Download" })}
        </button>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-4 py-4">
        <div className="flex-1 relative ">
          <div
            className="relative w-full aspect-[9/16] md:aspect-[10/16] lg:aspect-[11/16] rounded-lg overflow-hidden border-2 border-green-900 shadow-lg"
            style={{
              backgroundImage: `url(${pitch})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <div className="absolute left-0 top-1/2 w-full h-[2px] bg-white/40 z-20" />

            {Object.entries(teamALines).map(([lineStr, players]) => {
              const line = Number(lineStr);
              const top = HOME_LINE_TOP[line] ?? 50;
              return players.map((p, idx) => {
                const left = getLeftPercent(idx, players.length);
                return (
                  <PlayerMarker
                    key={`A-${p.name}`}
                    player={p}
                    top={top}
                    left={left}
                    color={HOME_COLOR}
                  />
                );
              });
            })}

            {Object.entries(teamBLines).map(([lineStr, players]) => {
              const line = Number(lineStr);
              const top = AWAY_LINE_TOP[line] ?? 50;
              return players.map((p, idx) => {
                const left = getLeftPercent(idx, players.length);
                return (
                  <PlayerMarker
                    key={`B-${p.name}`}
                    player={p}
                    top={top}
                    left={left}
                    color={AWAY_COLOR}
                  />
                );
              });
            })}
          </div>
        </div>

        <div className="lg:w-1/3 flex flex-col gap-4 order-first lg:order-last">
          <div className="bg-brand-navbar rounded-lg p-2">
            <div className="flex items-center gap-2 py-1 px-2">
              <Logo
                src={teamA.teamLogo}
                customImageClass="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                name={teamA.teamName}
              />
              <div className="flex flex-col">
                <span className="truncate font-semibold">{teamA.teamName}</span>
                <span className="text-xs font-semibold uppercase text-brand-success">
                  {teamA.teamFormation}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 my-2 px-2 border-b border-white/20 pb-1">
              <span className="font-semibold text-brand-cream text-sm">
                {t("lineups.substitutes")}
              </span>
            </div>
            <ul className="space-y-1 max-h-65 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-green/40">
              {teamA.substitutes.length ? (
                teamA.substitutes.map((sub) => (
                  <li
                    key={`${sub.name}-${sub.number}`}
                    className="flex justify-between"
                  >
                    <span className="text-[11px] sm:text-xs text-brand-white uppercase truncate">
                      {sub.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-brand-purple uppercase truncate">
                      {sub.number}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No substitutes listed</li>
              )}
            </ul>
          </div>

          <div className="bg-brand-navbar rounded-lg p-3">
            <div className="flex items-center gap-2 py-1 px-2">
              <Logo
                src={teamB.teamLogo}
                customImageClass="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                name={teamB.teamName}
              />
              <div className="flex flex-col">
                <span className="truncate font-semibold text ">
                  {teamB.teamName}
                </span>
                <span className="text-xs font-semibold uppercase text-brand-success">
                  {teamB.teamFormation}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 my-2 px-2 border-b border-white/20 pb-1">
              <span className="font-semibold text-brand-cream text-sm">
                {t("lineups.substitutes")}
              </span>
            </div>
            <ul className="space-y-1 px-2 max-h-65 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-green/40">
              {teamB.substitutes.length ? (
                teamB.substitutes.map((sub) => (
                  <li
                    key={`${sub.name}-${sub.number}`}
                    className="flex justify-between"
                  >
                    <span className="text-[11px] sm:text-xs text-brand-white uppercase truncate">
                      {sub.name}
                    </span>
                    <span className="text-[11px] sm:text-xs text-brand-purple uppercase truncate">
                      {sub.number}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic">No substitutes listed</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchLineups;
