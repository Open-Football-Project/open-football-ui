import { useState } from "react";
import {
  LeagueInfo,
  LeagueTeamInfo,
  leagueGroupTranslation,
  buildStandingsSvgString,
  STANDINGS_SVG_W,
  getStandingsSvgH,
  SvgLeagueTableColDefinition,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";

import NoData from "../../../components/general/no-data/NoData";
import { LeagueStandingSkeleton } from "../../../components/general/skeleton/Skeleton";
import { LeagueTable } from "../league-table/LeagueTable";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";
import { SocialSharing } from "../../general/social-sharing/SocialSharing";

const SVG_TEAM_NAME_MAX_LENGTH = 20;
const SHARE_TOP_N = 5;
const SHARE_RELEGATION_N = 3;
const SHARE_MIN_TEAMS_FOR_RELEGATION = SHARE_TOP_N + SHARE_RELEGATION_N + 1;

function buildStandingsShareText(
  teams: LeagueTeamInfo[],
  leagueName: string,
  groupLabel: string | undefined,
): string {
  const header = groupLabel
    ? `🏆 ${leagueName} (${groupLabel})`
    : `🏆 ${leagueName}`;

  const top = teams
    .slice(0, SHARE_TOP_N)
    .map(
      (t, i) =>
        `${t.rank}. ${t.teamName} ${t.points}pts${i === 0 ? " 🔥" : ""}`,
    );

  const relegation =
    teams.length >= SHARE_MIN_TEAMS_FOR_RELEGATION
      ? [
          "...",
          ...teams
            .slice(-SHARE_RELEGATION_N)
            .map((t) => `${t.rank}. ${t.teamName} ⬇️`),
        ]
      : [];

  return [header, ...top, ...relegation, `futballero.com`].join("\n");
}

interface LeagueStandingProps {
  leagueInfo: LeagueInfo | undefined;
  loading: boolean;
}

type TranslateFn = (key: string, opts?: object) => string;

const truncateForSvg = (name: string) =>
  name.length > SVG_TEAM_NAME_MAX_LENGTH
    ? name.slice(0, SVG_TEAM_NAME_MAX_LENGTH) + "…"
    : name;

const formItemTranslation = (t: TranslateFn, result: string): string => {
  switch (result) {
    case "W":
      return t("common.W", { defaultValue: "W" });
    case "D":
      return t("common.D", { defaultValue: "D" });
    default:
      return t("common.L", { defaultValue: "L" });
  }
};

function svgReportColumns(t: TranslateFn): SvgLeagueTableColDefinition[] {
  return [
    { label: "#", x: 0, w: 40, align: "center" },
    {
      label: t("leaguestanding.team", { defaultValue: "Team" }),
      x: 40,
      w: 210,
      align: "left",
    },
    {
      label: t("leaguestanding.pts", { defaultValue: "Pts" }),
      x: 250,
      w: 55,
      align: "center",
    },
    {
      label: t("leaguestanding.p", { defaultValue: "P" }),
      x: 305,
      w: 50,
      align: "center",
    },
    {
      label: t("leaguestanding.w", { defaultValue: "W" }),
      x: 355,
      w: 50,
      align: "center",
    },
    {
      label: t("leaguestanding.d", { defaultValue: "D" }),
      x: 405,
      w: 50,
      align: "center",
    },
    {
      label: t("leaguestanding.l", { defaultValue: "L" }),
      x: 455,
      w: 50,
      align: "center",
    },
    {
      label: t("leaguestanding.gf", { defaultValue: "GF" }),
      x: 505,
      w: 50,
      align: "center",
    },
    {
      label: t("leaguestanding.ga", { defaultValue: "GA" }),
      x: 555,
      w: 50,
      align: "center",
    },
    {
      label: t("leaguestanding.form", { defaultValue: "Form" }),
      x: 605,
      w: 195,
      align: "center",
    },
  ];
}

export default function LeagueStanding({
  leagueInfo,
  loading,
}: LeagueStandingProps) {
  if (loading)
    return <NoData loading={loading} skeleton={<LeagueStandingSkeleton />} />;
  if (!loading && !leagueInfo) return <NoData />;

  const { i18n, t: rawT } = useTranslation();
  const t = rawT as TranslateFn;
  const [downloading, setDownloading] = useState(false);
  const [teams, setTeams] = useState<LeagueTeamInfo[]>(
    leagueInfo?.group && leagueInfo?.group.length > 0
      ? leagueInfo?.group[0].teams
      : [],
  );

  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);

  const leagueNameLabel = cleanLeagueName(
    t(`league.${leagueTranslationKey(leagueInfo?.name ?? "")}`, {
      defaultValue: leagueInfo?.name ?? "",
    }),
  );

  const groupNames =
    leagueInfo?.group && leagueInfo?.group.length > 0
      ? leagueInfo?.group.map((groupLabel) =>
          leagueGroupTranslation(groupLabel.label ?? "", i18n.language),
        )
      : ["Default"];

  const handleSelectGroup = (groupNameIndex: number) => {
    setSelectedGroupIndex(groupNameIndex);
    setTeams(leagueInfo?.group[groupNameIndex].teams ?? []);
  };

  const setCurrentLeft = () => {
    const newIndex =
      selectedGroupIndex === 0 ? groupNames.length - 1 : selectedGroupIndex - 1;
    setSelectedGroupIndex(newIndex);
    setTeams(leagueInfo?.group[newIndex].teams ?? []);
  };

  const setCurrentRight = () => {
    const newIndex =
      selectedGroupIndex === groupNames.length - 1 ? 0 : selectedGroupIndex + 1;
    setSelectedGroupIndex(newIndex);
    setTeams(leagueInfo?.group[newIndex].teams ?? []);
  };

  const handleShare = () => {
    const groupLabel =
      groupNames.length > 1 ? groupNames[selectedGroupIndex] : undefined;
    const text = buildStandingsShareText(teams, leagueNameLabel, groupLabel);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const groupLabel =
        groupNames.length > 1 ? groupNames[selectedGroupIndex] : undefined;
      const name = leagueNameLabel;
      const svgString = buildStandingsSvgString(
        teams.map((team) => ({
          ...team,
          teamName: truncateForSvg(team.teamName),
        })),
        name,
        leagueInfo?.logo,
        groupLabel,
        svgReportColumns(t),
        (result) =>
          formItemTranslation(
            t as (key: string, opts?: object) => string,
            result,
          ),
      );
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const filename = `futballero-${name.replace(/\s+/g, "-").toLowerCase()}-standings.png`;
      await svgToPng(
        svgEl,
        filename,
        STANDINGS_SVG_W,
        getStandingsSvgH(teams.length),
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex justify-end px-1 -mt-[52px] mb-1">
        <SocialSharing
          handleDownload={handleDownload}
          handleShare={handleShare}
          downloading={downloading}
        />
      </div>

      {groupNames.length > 1 && (
        <div className="flex items-center mt-4 mb-2 w-full bg-brand-greena rounded-lg overflow-hidden ring-2 ring-brand-yellowa/30">
          <button
            data-testid={"button-left"}
            onClick={setCurrentLeft}
            className="px-2 py-1 hover:bg-white/10 transition"
          >
            <FaCaretLeft className="text-brand-white hover:text-brand-yellow transition-all hover:scale-110" />
          </button>

          <div className="w-[2px] self-stretch bg-brand-yellowa/30" />

          <div className="relative flex-1 bg-brand-darkBg group">
            <select
              data-testid={"drop-down-btn"}
              value={selectedGroupIndex}
              onChange={(e) => handleSelectGroup(Number(e.target.value))}
              className="
                appearance-none
                w-full h-full
                px-2 pr-7 py-1
                text-center uppercase font-semibold
                bg-brand-darkBg text-brand-white
                outline-none focus:outline-none focus:ring-0
              "
            >
              {groupNames.map((groupName, idx) => (
                <option key={`${groupName}-${idx}`} value={idx}>
                  {leagueGroupTranslation(groupName, i18n.language)}
                </option>
              ))}
            </select>

            <span
              className="
                pointer-events-none
                absolute right-3 top-1/2 -translate-y-1/2
                text-[12px]
                text-brand-white
                transition-colors
                group-focus-within:text-brand-white
              "
            >
              ▼
            </span>
          </div>

          <div className="w-[2px] self-stretch bg-brand-yellowa/30" />

          <button
            data-testid={"button-right"}
            onClick={setCurrentRight}
            className="px-2 py-1 hover:bg-white/10 transition"
          >
            <FaCaretRight className="text-brand-white hover:text-brand-yellow transition-all hover:scale-110" />
          </button>
        </div>
      )}

      <div className="mt-3 w-full">
        <LeagueTable teams={teams} />
      </div>
    </div>
  );
}
