import { useState } from "react";
import { Link } from "react-router-dom";

import Logo from "../../general/logo/Logo";
import { DayMatchesList } from "./day-matches/DayMatches";
import { useTranslation } from "react-i18next";
import { SocialSharing } from "../../general/social-sharing/SocialSharing";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

import {
  ApiService,
  cleanLeagueName,
  leagueTranslationKey,
  DayMatches,
  buildFixtureSvgString,
  getFixtureSvgH,
  FIXTURE_SVG_W,
  dayMatchesToFixtureRound,
  SITE_DOMAIN,
} from "open-football-project-core";

interface MatchesGridProps {
  leagueMatches: DayMatches[];
  apiService: ApiService;
}

const LeagueMatchesCard = ({
  league,
  apiService,
}: {
  league: DayMatches;
  apiService: ApiService;
}) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const leagueDisplayName = cleanLeagueName(
    t(`league.${leagueTranslationKey(league.leagueName)}`, {
      defaultValue: league.leagueName,
    }),
  );

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);

    try {
      const round = dayMatchesToFixtureRound(league);

      const svgString = buildFixtureSvgString(
        round,
        leagueDisplayName,
        league.leagueLogo ?? undefined,
      );

      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");

      const svgEl = doc.documentElement as unknown as SVGSVGElement;

      const filename = `footballproject-${leagueDisplayName
        .replace(/\s+/g, "-")
        .toLowerCase()}-matches.png`;

      await svgToPng(svgEl, filename, FIXTURE_SVG_W, getFixtureSvgH(round));
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const header = `⚽ ${league.leagueName}`;

    const lines = league.matches
      .slice(0, 10)
      .map((m) =>
        m.isFinished
          ? `${m.homeTeamName} ${m.homeTeamScore}-${m.awayTeamScore} ${m.awayTeamName}`
          : `${m.homeTeamName} vs ${m.awayTeamName}`,
      );

    const text = [header, ...lines, SITE_DOMAIN].join("\n");

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="bg-brand-card rounded-lg flex flex-col mb-3 overflow-hidden ring-1 ring-brand-dona">
      <div className="flex items-center justify-between bg-brand-grayint px-4 py-2">
        <Link
          to={`/league/${league.leagueId}`}
          className="flex items-center gap-2 sm:gap-3 min-w-[70px]"
        >
          <Logo
            src={league.leagueLogo ?? undefined}
            customImageClass="w-6 h-6 bg-white"
            customIconClass="w-5 h-5"
            name={league.leagueName}
          />

          <span className="text-brand-white hover:underline hover:text-brand-orange text-[12px] uppercase font-semibold truncate">
            {leagueDisplayName}
          </span>
        </Link>

        <SocialSharing
          handleDownload={handleDownload}
          handleShare={handleShare}
          downloading={downloading}
        />
      </div>

      <div className="px-1.5 py-3">
        <DayMatchesList matches={league.matches} apiService={apiService} />
      </div>
    </div>
  );
};

const MatchesGrid = ({ leagueMatches, apiService }: MatchesGridProps) => (
  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
    {leagueMatches.map((league) => (
      <LeagueMatchesCard
        key={league.leagueId}
        league={league}
        apiService={apiService}
      />
    ))}
  </div>
);

export default MatchesGrid;
