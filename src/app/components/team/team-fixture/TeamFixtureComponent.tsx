import { useState } from "react";
import {
  ApiService,
  useTeamFixture,
  TeamFixtureMatch,
  buildFixtureSvgString,
  getFixtureSvgH,
  FIXTURE_SVG_W,
  teamFixtureMatchesToFixtureRound,
  SITE_DOMAIN,
} from "open-football-project-core";
import MatchCard from "../../match/match-card/MatchCard";
import { useTranslation } from "react-i18next";
import { SocialSharing } from "../../general/social-sharing/SocialSharing";
import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

interface TeamFixtureProps {
  teamId: number;
  apiService: ApiService;
  teamName?: string;
  teamLogo?: string;
}

const TeamFixtureComponent = ({
  teamId,
  apiService,
  teamName = "",
  teamLogo,
}: TeamFixtureProps) => {
  const {
    isPreviousMatchesAvailable,
    isUpcommingMatchesAvailable,
    teamFixture,
  } = useTeamFixture(apiService, teamId);

  const { t } = useTranslation();
  const [downloadingPrev, setDownloadingPrev] = useState(false);
  const [downloadingNext, setDownloadingNext] = useState(false);

  const previousMatches = teamFixture?.previous ?? [];
  const upcomingMatches = teamFixture?.upcoming ?? [];

  const handleDownload = async (
    matches: TeamFixtureMatch[],
    label: string,
    setDownloading: (v: boolean) => void,
  ) => {
    if (!matches.length) return;
    setDownloading(true);
    try {
      const round = teamFixtureMatchesToFixtureRound(matches, label);
      const svgString = buildFixtureSvgString(round, teamName, teamLogo);
      const doc = new DOMParser().parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.documentElement as unknown as SVGSVGElement;
      const slug = teamName.replace(/\s+/g, "-").toLowerCase();
      const labelSlug = label.replace(/\s+/g, "-").toLowerCase();
      await svgToPng(
        svgEl,
        `footballproject-${slug}-${labelSlug}.png`,
        FIXTURE_SVG_W,
        getFixtureSvgH(round),
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = (matches: TeamFixtureMatch[], label: string) => {
    const header = teamName ? `⚽ ${teamName}` : "⚽";
    const lines = matches
      .slice(0, 6)
      .map((m) =>
        m.isFinished
          ? `${m.homeTeamName} ${m.homeTeamScore}-${m.awayTeamScore} ${m.awayTeamName}`
          : `${m.homeTeamName} vs ${m.awayTeamName}`,
      );
    const text = [header, label, ...lines, SITE_DOMAIN].join("\n");
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const renderMatchItem = (match: (typeof previousMatches)[number]) => (
    <MatchCard key={match.fixtureId} match={match} apiService={apiService} />
  );

  const renderMatchesList = (matches: typeof previousMatches) => (
    <ul className="flex flex-col w-full space-y-2">
      {matches.map((match) => (
        <div
          key={match.fixtureId}
          className="w-full flex flex-col items-center"
        >
          {renderMatchItem(match)}
        </div>
      ))}
    </ul>
  );

  const prevLabel = t("common.prev_matches", { defaultValue: "Previous" });
  const nextLabel = t("common.next_matches", { defaultValue: "Upcoming" });

  return (
    <div className="w-full my-12 mx-auto px-4">
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {isPreviousMatchesAvailable && (
          <div className="w-full lg:w-1/2">
            <div className="bg-brand-card p-2 h-full flex flex-col ">
             <h4 className="py-2 px-4 mb-4 text-left font-semibold bg-black/40 text-brand-cream rounded-t-lg truncate">
               {prevLabel}
             </h4>
              <div className="w-full">
              <div className="flex justify-end px-1 -mt-[52px] mb-1">
              <SocialSharing
                handleDownload={() =>
                  handleDownload(previousMatches, prevLabel, setDownloadingPrev)
                }
                handleShare={() => handleShare(previousMatches, prevLabel)}
                downloading={downloadingPrev}
              />
              </div>
             </div>
              <div className="flex-1 overflow-y-auto">
                {renderMatchesList(previousMatches)}
              </div>
            </div>
          </div>
        )}
        {isUpcommingMatchesAvailable && (
          <div className="w-full lg:w-1/2">
            <div className="bg-brand-card p-2 h-full flex flex-col">
             <h4 className="py-2 px-4 mb-4 text-left font-semibold bg-black/40 text-brand-cream rounded-t-lg truncate">
               {nextLabel}
             </h4>
              <div className="w-full">
              <div className="flex justify-end px-1 -mt-[52px] mb-1">
              <SocialSharing
                handleDownload={() =>
                  handleDownload(upcomingMatches, nextLabel, setDownloadingNext)
                }
                handleShare={() => handleShare(upcomingMatches, nextLabel)}
                downloading={downloadingNext}
              />
             </div>
             </div>
              <div className="flex-1 overflow-y-auto">
                {renderMatchesList(upcomingMatches)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamFixtureComponent;
