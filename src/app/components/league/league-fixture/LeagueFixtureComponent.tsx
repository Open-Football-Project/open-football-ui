import { useRef, useState } from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import NoData from "../../../components/general/no-data/NoData";
import { FixtureListSkeleton } from "../../../components/general/skeleton/Skeleton";
import { SocialSharing } from "../../general/social-sharing/SocialSharing";
import MatchCard from "../../match/match-card/MatchCard";

import { svgToPng } from "../../../converter/svg-png-converter/svg-png-converter";

import {
  ApiService,
  LeagueFixture,
  LeagueFixturesMatch,
  sortLeagueFixturesMatch,
  buildFixtureSvgString,
  getFixtureSvgH,
  FIXTURE_SVG_W,
  cleanLeagueName,
  leagueTranslationKey,
} from "@matchinsights/core";

import { useRovingTabIndex } from "../../../special-hooks/roving-tabindex/roving-tabindex";

interface LeagueFixtureProps {
  fixture: LeagueFixture | undefined;
  loading: boolean;
  apiService: ApiService;
  leagueName?: string;
  leagueLogo?: string;
}

export const LeagueFixtureComponent = ({
  fixture,
  loading,
  apiService,
  leagueName = "",
  leagueLogo,
}: LeagueFixtureProps) => {
  const { t } = useTranslation();

  const allFocusable = useRef<(HTMLElement | null)[]>([]);
  const { onFocus, handleKeyDown } = useRovingTabIndex(allFocusable);

  if (loading) {
    return <NoData loading={loading} skeleton={<FixtureListSkeleton />} />;
  }

  if (!loading && !(Number(fixture?.totalRounds) > 0)) {
    return <NoData />;
  }

  const [currentRoundIndex, setCurrentRoundIndex] = useState(
    fixture?.currentRoundIndex ?? 0,
  );

  const [downloading, setDownloading] = useState(false);

  const leagueNameLabel = cleanLeagueName(
    t(`league.${leagueTranslationKey(leagueName)}`, {
      defaultValue: leagueName,
    }),
  );

  const roundNames = fixture?.rounds
    ? fixture.rounds.map((it) => it.name)
    : [];

  const trKey = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/-/g, "_")
      .replace(/\s+/g, "_")
      .replace(/__+/g, "_");

  const handleSelectRound = (roundIndex: number) => {
    setCurrentRoundIndex(roundIndex);
  };

  const setCurrentLeft = () =>
    setCurrentRoundIndex(
      roundNames.length > 0 && currentRoundIndex === 0
        ? roundNames.length - 1
        : currentRoundIndex - 1,
    );

  const setCurrentRight = () =>
    setCurrentRoundIndex(
      roundNames.length > 0 && currentRoundIndex === roundNames.length - 1
        ? 0
        : currentRoundIndex + 1,
    );

  const roundNameDisplayedFormat = (roundName: string): string => {
    if (!roundName) return "Round Unknown";

    return t(`fixtures.${trKey(roundName)}`, {
      defaultValue: roundName,
    });
  };

  const sharingRound = () => {
    const round = fixture?.rounds[currentRoundIndex];

    if (!round) return undefined;

    return {
      ...round,
      name: roundNameDisplayedFormat(round.name),
    };
  };

  const handleDownload = async () => {
    if (downloading) return;

    const round = sharingRound();

    if (!round) return;

    setDownloading(true);

    try {
      const svgString = buildFixtureSvgString(
        round,
        leagueNameLabel,
        leagueLogo,
      );

      const doc = new DOMParser().parseFromString(
        svgString,
        "image/svg+xml",
      );

      const svgEl = doc.documentElement as unknown as SVGSVGElement;

      const filename = `futballero-${leagueNameLabel
        .replace(/\s+/g, "-")
        .toLowerCase()}-fixtures.png`;

      await svgToPng(
        svgEl,
        filename,
        FIXTURE_SVG_W,
        getFixtureSvgH(round),
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    const round = sharingRound();

    if (!round) return;

    const header = leagueNameLabel ? `⚽ ${leagueNameLabel}` : "⚽";

    const allMatches = round.days.flatMap((d) => d.matches);

    const lines = allMatches
      .slice(0, 10)
      .map((m) =>
        m.isFinished
          ? `${m.homeTeamName} ${m.homeTeamScore}-${m.awayTeamScore} ${m.awayTeamName}`
          : `${m.homeTeamName} vs ${m.awayTeamName}`,
      );

    const text = [
      header,
      roundNameDisplayedFormat(round.name),
      ...lines,
      "futballero.com",
    ].join("\n");

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="w-full md:max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full">
        <div className="flex justify-end px-1 -mt-[52px] mb-1">
          <SocialSharing
            handleDownload={handleDownload}
            handleShare={handleShare}
            downloading={downloading}
          />
        </div>
      </div>

      <div className="flex items-center -mt-1 mb-1 w-full bg-brand-greena rounded-lg overflow-hidden ring-2 ring-brand-yellowa/30">
        <button
          data-testid="left-round"
          aria-label={t("aria.leagueFixtures.prevRound")}
          onClick={setCurrentLeft}
          className="px-2 py-1 hover:bg-white/10 transition"
        >
          <FaCaretLeft className="text-brand-white hover:text-brand-yellow transition-all hover:scale-110" />
        </button>

        <div className="w-[2px] self-stretch bg-brand-yellowa/30" />

        <div className="relative flex-1 bg-brand-darkBg group">
          <select
            aria-label={t("aria.leagueFixtures.roundSelect")}
            value={currentRoundIndex}
            onChange={(e) => handleSelectRound(Number(e.target.value))}
            className="
              appearance-none
              w-full h-full
              px-2 pr-7 py-1
              text-center uppercase font-semibold
              bg-brand-darkBg text-brand-white
              outline-none focus:outline-none focus:ring-0
            "
          >
            {roundNames.map((roundName, idx) => (
              <option
                key={`${roundName}-${idx}`}
                data-testid={`round-${idx}`}
                value={idx}
              >
                {roundNameDisplayedFormat(roundName)}
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
          data-testid="right-round"
          aria-label={t("aria.leagueFixtures.nextRound")}
          onClick={setCurrentRight}
          className="px-2 py-1 hover:bg-white/10 transition"
        >
          <FaCaretRight className="text-brand-white hover:text-brand-yellow transition-all hover:scale-110" />
        </button>
      </div>

      {roundNames.length > 0 &&
        (() => {
          if (allFocusable.current.length > 0) {
            allFocusable.current = [];
          }

          return (
            <div
              tabIndex={0}
              onFocus={onFocus}
              onKeyDown={handleKeyDown}
              className="w-full roving-container"
            >
              {fixture?.rounds[currentRoundIndex].days.map((roundDays) => (
                <div
                  key={roundDays.date}
                  className="w-full mx-auto mt-2 mb-2"
                >
                  <ul className="space-y-2 flex flex-col items-center">
                    {sortLeagueFixturesMatch(roundDays.matches).map(
                      (match: LeagueFixturesMatch) => (
                        <MatchCard
                          key={match.fixtureId}
                          match={match}
                          apiService={apiService}
                          ref={(el) => {
                            if (el) {
                              allFocusable.current.push(el);
                            }
                          }}
                          tabIndex={-1}
                          className="roving-item"
                        />
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          );
        })()}
    </div>
  );
};