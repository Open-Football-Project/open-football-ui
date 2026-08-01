import { useState } from "react";
import {
  ApiService,
  Goal,
  Score,
  Venue,
  League,
  Team,
  useCharteableMatchNow,
  useTopGuysAvailable,
} from "open-football-project-core";
import { Link } from "react-router-dom";
import TeamDetailsInfo from "./team-details-info/TeamDetailsInfo";

import MatchButton from "../../../general/match-button/MatchButton";
import ChartButton from "../../../general/chart-button/ChartButton";
import TopGuysButton from "../../../general/top-guys-button/TopGuysButton";
import { useTranslation } from "react-i18next";
import {
  leagueTranslationKey,
  matchLongStatusToKey,
  getFormattedDate,
  getFormattedTime,
  cleanLeagueName,
  buildMatchInfoSvgString,
  getMatchInfoSvgH,
  MATCH_INFO_SVG_W,
  SITE_DOMAIN,
} from "open-football-project-core";

import { svgToPng } from "../../../../converter/svg-png-converter/svg-png-converter";
import { SocialSharing } from "../../../general/social-sharing/SocialSharing";

interface DetailsMainInfoProps {
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  league: League;
  venue: Venue;
  goals: Goal;
  score: Score;
  statusLong: string;
  isLiveNow: boolean;
  fixtureId: number;
  apiService: ApiService;
}

export const DetailsMainInfo = ({
  homeTeam,
  awayTeam,
  date,
  league,
  venue,
  goals,
  score,
  statusLong,
  isLiveNow,
  fixtureId,
  apiService,
}: DetailsMainInfoProps) => {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);
  const { isCharteableMatchNow } = useCharteableMatchNow(apiService, fixtureId);
  const { isTopGuysAvailable } = useTopGuysAvailable(apiService, fixtureId);

  const hasPenalties =
    score?.penalty?.home !== null &&
    score?.penalty?.away !== null &&
    score?.penalty?.home !== undefined &&
    score?.penalty?.away !== undefined;

  const statusLabel = !isLiveNow
    ? t(`matchstatuslong.${matchLongStatusToKey(statusLong)}`, {
        defaultValue: statusLong,
      })
    : undefined;

  const leagueNameLabel = cleanLeagueName(
    t(`league.${leagueTranslationKey(league.name)}`, {
      defaultValue: league.name,
    }),
  );

  const handleShare = () => {
    const resultLine = hasPenalties
      ? `(${score?.penalty?.home}) ${goals.home ?? "-"} - ${
          goals.away ?? "-"
        } (${score?.penalty?.away})`
      : `${goals.home ?? "-"} - ${goals.away ?? "-"}`;

    const lines = [
      `⚽ ${homeTeam.name} vs ${awayTeam.name}`,
      resultLine,
      `🏆 ${leagueNameLabel}`,
      `📅 ${getFormattedDate(date)}, ${getFormattedTime(date)}`,
      SITE_DOMAIN,
    ];

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        lines.join("\n"),
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);

    try {
      const svgString = buildMatchInfoSvgString({
        homeTeamName: homeTeam.name,
        homeTeamLogo: homeTeam.logo,
        awayTeamName: awayTeam.name,
        awayTeamLogo: awayTeam.logo,
        goalsHome: goals.home,
        goalsAway: goals.away,
        score,
        leagueName: leagueNameLabel,
        leagueLogo: league.logo,
        venueName: venue.name,
        venueCity: venue.city,
        formattedDate: `${getFormattedDate(date)}, ${getFormattedTime(date)}`,
        statusLabel,
        labels: {
          ht: t("common.HT"),
          ft: t("common.FT"),
          et: t("common.ET"),
          pen: t("common.PEN"),
        },
      });

      const doc = new DOMParser().parseFromString(
        svgString,
        "image/svg+xml",
      );

      const svgEl = doc.documentElement as unknown as SVGSVGElement;

      const slug = (s: string) =>
        s.replace(/\s+/g, "-").toLowerCase();

      const filename = `footballproject-${slug(
        homeTeam.name,
      )}-vs-${slug(awayTeam.name)}.png`;

      await svgToPng(
        svgEl,
        filename,
        MATCH_INFO_SVG_W,
        getMatchInfoSvgH(!!statusLabel),
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="w-full bg-brand-700">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-3 items-center text-center gap-6 mt-8 overflow-x-auto">
          <TeamDetailsInfo team={homeTeam} />

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-2 mt-4">
              {hasPenalties && (
                <span className="text-brand-dona text-sm sm:text-lg font-bold">
                  ({score?.penalty?.home})
                </span>
              )}

              <p className="text-2xl sm:text-3xl font-extrabold text-brand-white leading-none whitespace-nowrap">
                {goals.home ?? "-"} - {goals.away ?? "-"}
              </p>

              {hasPenalties && (
                <span className="text-brand-dona text-sm sm:text-lg font-bold">
                  ({score?.penalty?.away})
                </span>
              )}
            </div>

            <div className="flex gap-4 mt-12 flex-wrap justify-center">
              <div className="text-center">
                <p className="text-xs text-brand-cream font-semibold">
                  {t("common.HT")}
                </p>

                <p className="text-xs font-bold">
                  {score?.halftime?.home ?? "-"} :{" "}
                  {score?.halftime?.away ?? "-"}
                </p>
              </div>

              <div className="text-center">
                <p className="text-xs text-brand-cream font-semibold">
                  {t("common.FT")}
                </p>

                <p className="text-xs font-bold">
                  {score?.fulltime?.home ?? "-"} :{" "}
                  {score?.fulltime?.away ?? "-"}
                </p>
              </div>

              {score?.extratime && (
                <div className="text-center">
                  <p className="text-xs text-brand-cream font-semibold">
                    {t("common.ET")}
                  </p>

                  <p className="text-xs font-bold">
                    {score?.extratime?.home ?? "-"} :{" "}
                    {score?.extratime?.away ?? "-"}
                  </p>
                </div>
              )}

              {hasPenalties && (
                <div className="text-center">
                  <p className="text-xs text-brand-cream font-semibold">
                    {t("common.PEN")}
                  </p>

                  <p className="text-xs font-bold">
                    {score?.penalty?.home} : {score?.penalty?.away}
                  </p>
                </div>
              )}
            </div>
          </div>

          <TeamDetailsInfo team={awayTeam} />
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          <Link
            data-testid="league-link"
            to={`/league/${league.id}`}
            className="text-sm font-semibold uppercase text-brand-white hover:text-brand-orange hover:underline transition"
          >
            🏆{" "}
            {league?.id
              ? cleanLeagueName(
                  t(`league.${leagueTranslationKey(league.name)}`, {
                    defaultValue: league.name,
                  }),
                )
              : t("common.unknown")}
          </Link>

          {venue.name && venue.city && (
            <div
              data-testid="venue-details"
              className="text-xs text-brand-lightGray uppercase text-center max-w-md"
            >
              <p className="break-words whitespace-normal">
                📍 {venue.name}
              </p>

              <p className="break-words whitespace-normal">
                {venue.city}
              </p>
            </div>
          )}

          <p
            data-testid="match-date"
            className="text-sm text-brand-yellow"
          >
            📅 {getFormattedDate(date)}, {getFormattedTime(date)}
          </p>

          {!isLiveNow && (
            <p
              data-testid="match-status"
              className="text-xs text-brand-orange"
            >
              {t(`matchstatuslong.${matchLongStatusToKey(statusLong)}`, {
                defaultValue: statusLong,
              })}
            </p>
          )}
        </div>
        <div className="mt-4 pt-3 border-t border-brand-darkBg flex items-center justify-center gap-2 flex-wrap">
          {isLiveNow && <MatchButton isLiveNow={isLiveNow} fixtureId={fixtureId} />}
          {isCharteableMatchNow && <ChartButton fixtureId={fixtureId} />}
          {isTopGuysAvailable && <TopGuysButton fixtureId={fixtureId} />}
          <SocialSharing
            handleShare={handleShare}
            handleDownload={handleDownload}
            downloading={downloading}
          />
        </div>
      </div>
    </div>
  );
};